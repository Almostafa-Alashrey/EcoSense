def test_register_company(client):
    response = client.post(
        "/auth/register-company",
        json={
            "company_name": "Eco Factory",
            "industry": "Manufacturing",
            "location": "Suez",
            "email": "owner@example.com",
            "password": "StrongPass123!",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["company"]["id"] > 0
    assert data["user"]["email"] == "owner@example.com"
    assert data["user"]["role"] == "owner"


def test_duplicate_email_rejected(client):
    payload = {
        "company_name": "Factory One",
        "email": "owner@example.com",
        "password": "StrongPass123!",
    }

    first = client.post("/auth/register-company", json=payload)
    second = client.post(
        "/auth/register-company",
        json={
            **payload,
            "company_name": "Factory Two",
        },
    )

    assert first.status_code == 201
    assert second.status_code == 409


def test_login_and_get_account(client):
    client.post(
        "/auth/register-company",
        json={
            "company_name": "Login Factory",
            "email": "login@example.com",
            "password": "StrongPass123!",
        },
    )

    login = client.post(
        "/auth/login",
        data={
            "username": "login@example.com",
            "password": "StrongPass123!",
        },
    )

    assert login.status_code == 200
    token = login.json()["access_token"]

    account = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert account.status_code == 200
    assert account.json()["email"] == "login@example.com"


def test_wrong_password_rejected(client):
    client.post(
        "/auth/register-company",
        json={
            "company_name": "Password Factory",
            "email": "password@example.com",
            "password": "StrongPass123!",
        },
    )

    response = client.post(
        "/auth/login",
        data={
            "username": "password@example.com",
            "password": "WrongPass123!",
        },
    )

    assert response.status_code == 401


def test_invalid_token_rejected(client):
    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer invalid-token"},
    )

    assert response.status_code == 401