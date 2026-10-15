from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import get_db
from models import Company
from auth_models import User
from schemas_auth import (
    RegisterCompanyRequest,
    RegisterResponse,
    TokenOut,
    UserOut,
)
from security import (
    create_access_token,
    hash_password,
    verify_password,
)
from deps import get_current_user


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register-company",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_company(
    data: RegisterCompanyRequest,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == str(data.email).lower())
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    existing_company = (
        db.query(Company)
        .filter(Company.name == data.company_name)
        .first()
    )
    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Company name is already registered",
        )

    try:
        company = Company(
            name=data.company_name,
            industry=data.industry,
            location=data.location,
        )
        db.add(company)
        db.flush()

        user = User(
            company_id=company.id,
            email=str(data.email).lower(),
            password_hash=hash_password(data.password),
            role="owner",
        )
        db.add(user)
        db.commit()
        db.refresh(company)
        db.refresh(user)

        return {"company": company, "user": user}

    except Exception:
        db.rollback()
        raise


@router.post("/login", response_model=TokenOut)
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    email = form.username.strip().lower()
    user = db.query(User).filter(User.email == email).first()

    if (
        user is None
        or not user.is_active
        or not verify_password(form.password, user.password_hash)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(
        user_id=user.id,
        company_id=user.company_id,
        role=user.role,
    )
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def get_my_account(
    current_user: User = Depends(get_current_user),
):
    return current_user