"use strict";
const { useState, useMemo, useEffect, useRef, createContext, useContext } = React;
const mkIcon = d => ({ size = 20, color = 'currentColor', className }) => React.createElement("svg", { className: className, width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
    React.createElement("path", { d: d }));
const Zap = mkIcon("M13 2 3 14h9l-1 8 10-12h-9l1-8z");
const Droplet = mkIcon("M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z");
const Bell = mkIcon("M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0");
const Search = mkIcon("M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM21 21l-4.3-4.3");
const Info = mkIcon("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 16v-4M12 8h.01");
const ArrowDown = mkIcon("M12 5v14M19 12l-7 7-7-7");
const ArrowUp = mkIcon("M12 19V5M5 12l7-7 7 7");
const ArrowRight = mkIcon("M5 12h14M12 5l7 7-7 7");
const ChevronDown = mkIcon("m6 9 6 6 6-6");
const Home = mkIcon("m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10");
const BarChart3 = mkIcon("M3 3v18h18M18 17V9M13 17V5M8 17v-3");
const Calculator = mkIcon("M4 2h16v20H4zM8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01");
const MapPin = mkIcon("M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6");
const FileText = mkIcon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8");
const ClipboardList = mkIcon("M9 5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9zM9 12h6M9 16h6");
const Settings = mkIcon("M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1");
const Leaf = mkIcon("M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12");
const AlertTriangle = mkIcon("m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3zM12 9v4M12 17h.01");
const Lightbulb = mkIcon("M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4");
const Fuel = mkIcon("M3 22h12M4 9h10M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5");
const Download = mkIcon("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3");
const mkChart = type => function C({ data, options }) { const ref = useRef(); useEffect(() => { const c = new Chart(ref.current, { type, data, options }); return () => c.destroy(); }, [JSON.stringify(data), JSON.stringify(options)]); return React.createElement("canvas", { ref: ref }); };
const Line = mkChart('line'), Bar = mkChart('bar');
const I18n = createContext({ lang: 'en', t: (k) => k });
const useI18n = () => useContext(I18n);
const dict = {
    en: {
        tagline: 'Smarter Resources. A Greener Tomorrow.', overview: 'Overview', dataEntry: 'Data Entry', analytics: 'Resource Analytics', simulator: 'Savings Simulator', recs: 'Recommendations', reports: 'Reports', settings: 'Settings',
        f1: 'Main Facility', f2: 'Factory 1', f3: 'Factory 2', search: 'Search...', hello: 'Good morning, Team', helloSub: "Here's your facility's resource overview and key insights.",
        p6: 'Last 6 months', p12: 'Last 12 months', electricity: 'Electricity', water: 'Water', fuel: 'Fuel', savings: 'Potential Savings', estAnnual: 'Estimated annually', vsPrev: 'vs. last month',
        trends: 'Monthly Consumption Trends', insight: 'Key Insight', insightText: 'The cooling system accounts for 32% of total electricity usage. Consider optimizing it to reduce energy waste.', viewRec: 'View Recommendation',
        alerts: 'Recent Alerts', viewAll: 'View all', demo: 'This dashboard shows demo data for presentation purposes only. No backend or live meters are connected.',
        a1: 'High electricity usage in Factory 2', a2: 'Water consumption above average', a3: 'Fuel usage increased by 2.1%', hAgo: '{n} hours ago',
        anTitle: 'Resource Analytics', anSub: 'Analyze your resource usage by department, period and more.', facility: 'Facility', period: 'Period', resource: 'Resource', all: 'All',
        deptTitle: 'Usage by Department', costTitle: 'Monthly Utility Costs', drivers: 'Top Consumption Drivers', rank: 'Rank', source: 'Source', share: 'Share of total', cost: 'Cost',
        dProd: 'Production', dCool: 'Cooling system', dLight: 'Lighting', dOff: 'Offices', dSan: 'Sanitation', dFleet: 'Vehicle fleet', dGen: 'Generators', dHeat: 'Heating',
        simTitle: 'Savings Simulator', simSub: 'Test different improvement scenarios and see estimated potential savings.', scenario: 'Improvement scenario', sc1: 'Upgrade cooling system', sc2: 'Improve lighting (LED)', sc3: 'Reduce water waste',
        implCost: 'Estimated implementation cost ($)', reduction: 'Expected resource reduction (%)', annualUse: 'Annual consumption', unitPrice: 'Unit price ($)', results: 'Results',
        annSave: 'Estimated annual savings', payback: 'Payback period', years: 'years', resRed: 'Resource reduction', co2: 'CO₂ reduction', co2u: 't CO₂ / year', compare: 'Cost comparison', current: 'Current annual cost', projected: 'After improvement',
        estNote: 'These figures are estimates based on your inputs and demo assumptions (CO₂ factors: 0.4 kg/kWh, 0.35 kg/m³, 2.68 kg/L). They are not guaranteed savings.',
        errNum: 'Enter a number greater than 0.', errPct: 'Enter a value between 1 and 100.', noPay: '—',
        recTitle: 'Recommendations', recSub: 'Smart suggestions to reduce waste and improve efficiency.', priority: 'Priority', high: 'High priority', medium: 'Medium', low: 'Low', issue: 'Issue', action: 'Suggested action', details: 'View Details', hide: 'Hide details',
        perYr: '/yr', benefit: 'Environmental benefit', empty: 'No recommendations match these filters.', impl: 'Implementation',
        r1i: 'Cooling system runs at full load overnight', r1a: 'Optimize cooling schedule and upgrade chillers', r2i: 'Legacy fluorescent lighting in all facilities', r2a: 'Replace with LED fixtures and motion sensors', r3i: 'Possible water leakage detected in Factory 2', r3a: 'Repair leaking pipes and install flow meters', r4i: 'Generators idle for long periods', r4a: 'Add auto-shutoff and maintenance schedule',
        repTitle: 'Reports', repSub: 'View and export your sustainability reports.', export: 'Export CSV', totalCons: 'Total consumption', totalCost: 'Total estimated cost', potSave: 'Potential annual savings', carbon: 'Estimated carbon emissions', monthly: 'Monthly Summary',
        sample: 'Sample figures from demo data. These are not measured results.', month: 'Month', setTitle: 'Settings', setSub: 'Preferences for this demo.', language: 'Language', defFac: 'Default facility', about: 'About', aboutText: 'EcoSense is a front-end demo. All values come from local sample data; there is no backend.',
        notif: 'Notifications',
profile: 'My Profile', fullName: 'Full Name', email: 'Email Address',
company: 'Company', role: 'Role', saveProfile: 'Save Changes',
profileSaved: 'Profile updated successfully.', editProfile: 'Edit Profile', unitHint: 'kWh = kilowatt-hours of electricity; m³ = cubic meters of water; L = liters of fuel.', payTip: 'Payback = implementation cost ÷ annual savings.', kwh: 'kWh', m3: 'm³', l: 'L'
    },
    ar: {
        tagline: 'موارد أذكى. مستقبل أكثر استدامة.', overview: 'الرئيسية', dataEntry: 'إدخال بيانات الاستهلاك', analytics: 'تحليلات الموارد', simulator: 'محاكي التوفير', recs: 'التوصيات', reports: 'التقارير', settings: 'الإعدادات',
        f1: 'المنشأة الرئيسية', f2: 'المصنع 1', f3: 'المصنع 2', search: 'بحث...', hello: 'صباح الخير، فريق العمل', helloSub: 'نظرة عامة على استهلاك الموارد في منشأتك وأهم المؤشرات.',
        p6: 'آخر 6 أشهر', p12: 'آخر 12 شهرًا', electricity: 'الكهرباء', water: 'المياه', fuel: 'الوقود', savings: 'التوفير المحتمل', estAnnual: 'تقدير سنوي', vsPrev: 'مقارنة بالشهر الماضي',
        trends: 'اتجاهات الاستهلاك الشهرية', insight: 'رؤية رئيسية', insightText: 'يمثل نظام التبريد 32% من إجمالي استهلاك الكهرباء. يُنصح بتحسينه لتقليل هدر الطاقة.', viewRec: 'عرض التوصية',
        alerts: 'أحدث التنبيهات', viewAll: 'عرض الكل', demo: 'تعرض لوحة المعلومات هذه بيانات تجريبية لأغراض العرض فقط. لا يوجد خادم أو عدادات فعلية متصلة.',
        a1: 'استهلاك مرتفع للكهرباء في المصنع 2', a2: 'استهلاك المياه أعلى من المتوسط', a3: 'ارتفع استهلاك الوقود بنسبة 2.1%', hAgo: 'منذ {n} ساعات',
        anTitle: 'تحليلات الموارد', anSub: 'حلّل استهلاك الموارد حسب القسم والفترة وغيرها.', facility: 'المنشأة', period: 'الفترة', resource: 'المورد', all: 'الكل',
        deptTitle: 'الاستهلاك حسب القسم', costTitle: 'تكاليف المرافق الشهرية', drivers: 'أكبر مسببات الاستهلاك', rank: 'الترتيب', source: 'المصدر', share: 'النسبة من الإجمالي', cost: 'التكلفة',
        dProd: 'الإنتاج', dCool: 'نظام التبريد', dLight: 'الإضاءة', dOff: 'المكاتب', dSan: 'الصرف والنظافة', dFleet: 'أسطول المركبات', dGen: 'المولدات', dHeat: 'التدفئة',
        simTitle: 'محاكي التوفير', simSub: 'جرّب سيناريوهات تحسين مختلفة وشاهد التوفير المحتمل التقديري.', scenario: 'سيناريو التحسين', sc1: 'ترقية نظام التبريد', sc2: 'تحسين الإضاءة (LED)', sc3: 'تقليل هدر المياه',
        implCost: 'تكلفة التنفيذ التقديرية ($)', reduction: 'نسبة خفض المورد المتوقعة (%)', annualUse: 'الاستهلاك السنوي', unitPrice: 'سعر الوحدة ($)', results: 'النتائج',
        annSave: 'التوفير السنوي التقديري', payback: 'فترة الاسترداد', years: 'سنة', resRed: 'خفض المورد', co2: 'خفض ثاني أكسيد الكربون', co2u: 'طن CO₂ / سنة', compare: 'مقارنة التكاليف', current: 'التكلفة السنوية الحالية', projected: 'بعد التحسين',
        estNote: 'هذه الأرقام تقديرات مبنية على مدخلاتك وافتراضات تجريبية (معاملات CO₂: ‏0.4 كغ/ك.و.س، ‏0.35 كغ/م³، ‏2.68 كغ/لتر). وهي ليست توفيرًا مضمونًا.',
        errNum: 'أدخل رقمًا أكبر من 0.', errPct: 'أدخل قيمة بين 1 و100.', noPay: '—',
        recTitle: 'التوصيات', recSub: 'اقتراحات ذكية لتقليل الهدر وتحسين الكفاءة.', priority: 'الأولوية', high: 'أولوية عالية', medium: 'متوسطة', low: 'منخفضة', issue: 'المشكلة', action: 'الإجراء المقترح', details: 'عرض التفاصيل', hide: 'إخفاء التفاصيل',
        perYr: '/سنة', benefit: 'الفائدة البيئية', empty: 'لا توجد توصيات مطابقة لهذه الفلاتر.', impl: 'التنفيذ',
        r1i: 'يعمل نظام التبريد بكامل الحمل ليلًا', r1a: 'تحسين جدول التبريد وترقية المبرّدات', r2i: 'إضاءة فلورية قديمة في جميع المنشآت', r2a: 'استبدالها بإضاءة LED ومستشعرات حركة', r3i: 'رصد تسرب محتمل للمياه في المصنع 2', r3a: 'إصلاح الأنابيب المتسربة وتركيب عدادات تدفق', r4i: 'المولدات تعمل دون حمل لفترات طويلة', r4a: 'إضافة إيقاف تلقائي وجدول صيانة',
        repTitle: 'التقارير', repSub: 'اعرض وصدّر تقارير الاستدامة الخاصة بك.', export: 'تصدير CSV', totalCons: 'إجمالي الاستهلاك', totalCost: 'إجمالي التكلفة التقديرية', potSave: 'التوفير السنوي المحتمل', carbon: 'الانبعاثات الكربونية التقديرية', monthly: 'الملخص الشهري',
        sample: 'أرقام نموذجية من بيانات تجريبية، وليست نتائج قياس فعلية.', month: 'الشهر', setTitle: 'الإعدادات', setSub: 'تفضيلات هذا العرض التجريبي.', language: 'اللغة', defFac: 'المنشأة الافتراضية', about: 'حول', aboutText: 'إيكو سنس عرض تجريبي للواجهة فقط. جميع القيم من بيانات محلية نموذجية ولا يوجد خادم.',
       notif: 'الإشعارات',
profile: 'الملف الشخصي', fullName: 'الاسم الكامل', email: 'البريد الإلكتروني',
company: 'الشركة', role: 'الوظيفة', saveProfile: 'حفظ التعديلات',
profileSaved: 'تم تحديث بيانات الملف الشخصي بنجاح.', editProfile: 'تعديل الملف الشخصي',  unitHint: 'ك.و.س = كيلوواط ساعة للكهرباء؛ م³ = متر مكعب للمياه؛ L = لتر للوقود.', payTip: 'فترة الاسترداد = تكلفة التنفيذ ÷ التوفير السنوي.', kwh: 'ك.و.س', m3: 'م³', l: 'لتر'
    }
};
const FACILITIES = { f1: 1, f2: 0.62, f3: 0.8 };
const SERIES = {
    electricity: [14.2, 13.1, 13.2, 13.8, 15.2, 13.4, 12.6, 13.9, 13.0, 12.9, 13.4, 14.5],
    water: [10.1, 8.2, 8.3, 8.6, 10.1, 8.4, 8.0, 8.9, 8.2, 8.3, 8.1, 9.0],
    fuel: [6.2, 5.1, 5.0, 5.5, 6.1, 5.0, 5.3, 6.2, 5.2, 5.1, 5.4, 5.7]
}; // thousands of kWh / m3 / L per month
const UNIT = { electricity: 'kwh', water: 'm3', fuel: 'l' };
const PRICE = { electricity: 0.12, water: 0.9, fuel: 1.1 }; // $ per unit
const CO2 = { electricity: 0.4, water: 0.35, fuel: 2.68 }; // kg per unit
const COLORS = { electricity: '#F59E0B', water: '#2F8DEB', fuel: '#8B5CF6', savings: '#10B981' };
const DEPTS = {
    electricity: [['dProd', 42], ['dCool', 31], ['dLight', 18], ['dOff', 12]],
    water: [['dProd', 34], ['dCool', 24], ['dSan', 16], ['dOff', 8]],
    fuel: [['dFleet', 45], ['dGen', 28], ['dHeat', 17], ['dProd', 10]]
};
const ALERTS = [
    { k: 'a1', sev: 'high', h: 2 }, { k: 'a2', sev: 'medium', h: 4 }, { k: 'a3', sev: 'info', h: 6 }
];
const RECS = [
    { id: 1, res: 'electricity', pri: 'high', cost: 12000, save: 8400, co2: 12.6 },
    { id: 2, res: 'electricity', pri: 'medium', cost: 8500, save: 5200, co2: 7.8 },
    { id: 3, res: 'water', pri: 'medium', cost: 6000, save: 3100, co2: 4.5 },
    { id: 4, res: 'fuel', pri: 'low', cost: 4200, save: 1750, co2: 6.2 }
];
const SCENARIOS = {
    sc1: { res: 'electricity', cost: 12000, red: 18, use: 150000 },
    sc2: { res: 'electricity', cost: 8500, red: 30, use: 60000 },
    sc3: { res: 'water', cost: 6000, red: 15, use: 101000 }
};
const NAV = [['overview', Home], ['dataEntry', ClipboardList], ['analytics', BarChart3], ['simulator', Calculator], ['recs', MapPin], ['reports', FileText], ['settings', Settings]];
const ICONS = { electricity: Zap, water: Droplet, fuel: Fuel, savings: Leaf };
const fmt = (n, d = 0) => Number(n).toLocaleString('en-US', { maximumFractionDigits: d });
function Logo() { const { t } = useI18n(); return React.createElement("div", { className: "logo" },
    React.createElement(Leaf, { size: 28, color: "#2DD4A0" }),
    React.createElement("b", null, "EcoSense")); }
function Sidebar({ page, go }) {
    const { t } = useI18n();
    return (React.createElement("aside", { className: "sidebar" },
        React.createElement(Logo, null),
        React.createElement("nav", { "aria-label": "Main" }, NAV.map(([k, Icon]) => (React.createElement("button", { key: k, className: 'nav-item' + (page === k ? ' active' : ''), onClick: () => go(k), "aria-current": page === k ? 'page' : undefined },
            React.createElement(Icon, { size: 20 }),
            React.createElement("span", null, t(k)))))),
        React.createElement("div", { className: "side-foot" },
            React.createElement(Leaf, { size: 34, color: "#2DD4A0" }),
            React.createElement("p", null, t('tagline')))));
}
function BottomNav({ page, go }) {
    const { t } = useI18n();
    return React.createElement("nav", { className: "bottom-nav", "aria-label": "Main" }, NAV.map(([k, Icon]) => (React.createElement("button", { key: k, className: page === k ? 'active' : '', onClick: () => go(k), "aria-current": page === k ? 'page' : undefined },
        React.createElement(Icon, { size: 20 }),
        React.createElement("span", null, t(k))))));
}

function Header({ fac, setFac, lang, setLang, setPage }) {
    const { t } = useI18n();
    const [query, setQuery] = useState('');

const [showNotifications, setShowNotifications] = useState(false);

const [notifications, setNotifications] = useState([
    {
        id: 1,
        en: "Energy consumption is higher than usual.",
        ar: "استهلاك الطاقة أعلى من المعتاد.",
        read: false
    },
    {
        id: 2,
        en: "Your weekly report is ready.",
        ar: "التقرير الأسبوعي جاهز.",
        read: false
    },
    {
        id: 3,
        en: "A new recommendation is available.",
        ar: "توصية جديدة متاحة.",
        read: true
    }
]);

const unreadCount = notifications.filter(
    (item) => !item.read
).length;

    const q = query.trim().toLowerCase();

    const matches = q
        ? NAV.filter(([key]) =>
            key.toLowerCase().includes(q) ||
            t(key).toLowerCase().includes(q)
        )
        : [];

    const choosePage = (key) => {
        setPage(key);
        setQuery('');
        window.scrollTo(0, 0);
    };

    return React.createElement("header", { className: "topbar" },
        React.createElement("div", { className: "mobile-logo" },
            React.createElement(Logo, null)
        ),

        React.createElement("label", { className: "select-wrap" },
            React.createElement("span", { className: "sr" }, t('facility')),
            React.createElement("select", {
                value: fac,
                onChange: (e) => setFac(e.target.value)
            },
                ['f1', 'f2', 'f3'].map((f) =>
                    React.createElement("option", {
                        key: f,
                        value: f
                    }, t(f))
                )
            ),
            React.createElement(ChevronDown, { size: 16 })
        ),

        React.createElement("div", {
            className: "search",
            style: { position: "relative" }
        },
            React.createElement(Search, { size: 16 }),

            React.createElement("input", {
                type: "search",
                placeholder: t('search'),
                "aria-label": t('search'),
                value: query,
                onChange: (e) => setQuery(e.target.value),
                onKeyDown: (e) => {
                    if (e.key === "Enter" && matches.length > 0) {
                        e.preventDefault();
                        choosePage(matches[0][0]);
                    }
                    if (e.key === "Escape") {
                        setQuery('');
                    }
                }
            }),

            matches.length > 0 &&
                React.createElement("div", {
                    className: "search-results",
                    style: {
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        background: "#ffffff",
                        color: "#1f2937",
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        padding: "6px"
                    }
                },
                    matches.map(([key, Icon]) =>
                        React.createElement("button", {
                            key: key,
                            type: "button",
                            onClick: () => choosePage(key),
                            style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                width: "100%",
                                padding: "12px",
                                border: 0,
                                borderRadius: "6px",
                                background: "transparent",
                                color: "inherit",
                                textAlign: "start",
                                cursor: "pointer",
                                font: "inherit"
                            }
                        },
                            React.createElement(Icon, { size: 18 }),
                            React.createElement("span", null, t(key))
                        )
                    )
                )
        ),

        React.createElement("div", {
            className: "lang",
            role: "group",
            "aria-label": t('language')
        },
            React.createElement("button", {
                className: lang === 'en' ? 'on' : '',
                onClick: () => setLang('en')
            }, "EN"),
            React.createElement("span", null, "|"),
            React.createElement("button", {
                className: lang === 'ar' ? 'on' : '',
                onClick: () => setLang('ar')
            }, "عربي")
        ),

        
React.createElement("div", {
    className: "notification-wrap",
    style: { position: "relative" }
},
    React.createElement("button", {
        type: "button",
        className: "icon-btn",
        "aria-label": t('notif'),
        "aria-expanded": showNotifications,
        onClick: () => setShowNotifications(!showNotifications)
    },
        React.createElement(Bell, { size: 20 }),
        unreadCount > 0 &&
            React.createElement("i", { className: "dot" })
    ),

    showNotifications &&
        React.createElement("div", {
            className: "notification-panel",
            style: {
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                width: "300px",
                maxWidth: "85vw",
                background: "#ffffff",
                color: "#1f2937",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                padding: "14px",
                zIndex: 2000
            }
        },
            React.createElement("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    marginBottom: "10px"
                }
            },
                React.createElement("strong", null,
                    lang === "ar" ? "الإشعارات" : "Notifications"
                ),

                React.createElement("button", {
                    type: "button",
                    onClick: () => setNotifications(
                        items => items.map(item => ({
                            ...item,
                            read: true
                        }))
                    ),
                    style: {
                        border: 0,
                        background: "transparent",
                        color: "#2563eb",
                        cursor: "pointer",
                        font: "inherit",
                        fontSize: "12px"
                    }
                },
                    lang === "ar" ? "قراءة الكل" : "Mark all read"
                )
            ),

            notifications.map(item =>
                React.createElement("button", {
                    key: item.id,
                    type: "button",
                    onClick: () => setNotifications(
                        items => items.map(n =>
                            n.id === item.id
                                ? { ...n, read: true }
                                : n
                        )
                    ),
                    style: {
                        display: "block",
                        width: "100%",
                        textAlign: lang === "ar" ? "right" : "left",
                        padding: "10px",
                        marginTop: "6px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        background: item.read ? "#ffffff" : "#eff6ff",
                        color: "#1f2937",
                        cursor: "pointer",
                        font: "inherit"
                    }
                },
                    React.createElement("span", null,
                        lang === "ar" ? item.ar : item.en
                    ),

                    !item.read &&
                        React.createElement("span", {
                            style: {
                                display: "block",
                                fontSize: "11px",
                                color: "#2563eb",
                                marginTop: "4px"
                            }
                        },
                            lang === "ar" ? "جديد" : "New"
                        )
                )
            )
        )
),


        
React.createElement("button", {
    type: "button",
    className: "avatar",
    "aria-label": "Open profile",
    onClick: () => setPage("profile"),
    style: {
        border: 0,
        cursor: "pointer",
        font: "inherit"
    }
}, "E")
);

}
function PageHead({ title, sub, children }) {
    return React.createElement("div", { className: "page-head" },
        React.createElement("div", null,
            React.createElement("h1", null, title),
            React.createElement("p", null, sub)),
        React.createElement("div", { className: "head-actions" }, children));
}
function Tip({ text }) { return React.createElement("span", { className: "tip", tabIndex: 0, title: text, "aria-label": text },
    React.createElement(Info, { size: 14 })); }
function StatCard({ res, label, value, unit, change, series }) {
    const { t } = useI18n();
    const Icon = ICONS[res];
    const down = change != null && change < 0;
    return (React.createElement("div", { className: 'stat ' + res },
        React.createElement("div", { className: "stat-ic" },
            React.createElement(Icon, { size: 22 })),
        React.createElement("div", { className: "stat-body" },
            React.createElement("span", { className: "stat-label" }, label),
            React.createElement("div", { className: "stat-val" },
                value,
                " ",
                React.createElement("small", null, unit)),
            change != null ? React.createElement("div", { className: 'chg ' + (down ? 'good' : 'bad') },
                down ? React.createElement(ArrowDown, { size: 14 }) : React.createElement(ArrowUp, { size: 14 }),
                Math.abs(change).toFixed(1),
                "% ",
                React.createElement("span", null, t('vsPrev'))) : React.createElement("div", { className: "chg muted" }, t('estAnnual'))),
        series && React.createElement(Spark, { data: series, res: res })));
}
function Spark({ data, res }) {
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${30 - ((v - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * 26}`).join(' ');
    return React.createElement("svg", { className: "spark", viewBox: "0 0 100 32", preserveAspectRatio: "none", "aria-hidden": "true" },
        React.createElement("polyline", { points: pts, fill: "none", stroke: "currentColor", strokeWidth: "2", vectorEffect: "non-scaling-stroke" }));
}
function ChartCard({ title, right, children, h = 280, className = '' }) {
    return React.createElement("section", { className: 'card ' + className },
        React.createElement("div", { className: "card-head" },
            React.createElement("h2", null, title),
            right),
        React.createElement("div", { className: "chart", style: { height: h } }, children));
}
function chartOpts(lang, unit, extra = {}) {
    const font = { family: lang === 'ar' ? 'Cairo, sans-serif' : 'Inter, sans-serif' };
    return { responsive: true, maintainAspectRatio: false, rtl: lang === 'ar', interaction: { mode: 'index', intersect: false },
        plugins: { legend: { rtl: lang === 'ar', labels: { usePointStyle: true, boxWidth: 8, font } }, tooltip: { rtl: lang === 'ar', bodyFont: font, titleFont: font, callbacks: { label: (c) => `${c.dataset.label}: ${fmt(c.parsed.y, 1)} ${unit || ''}` } } },
        scales: { x: { grid: { display: false }, ticks: { font } }, y: { beginAtZero: true, position: lang === 'ar' ? 'right' : 'left', ticks: { font } } }, ...extra };
}
function AlertCard({ a, text, time }) {
    const Icon = a.sev === 'high' ? AlertTriangle : a.sev === 'medium' ? AlertTriangle : Info;
    return React.createElement("li", { className: 'alert ' + a.sev },
        React.createElement("span", { className: "al-ic" },
            React.createElement(Icon, { size: 16 })),
        React.createElement("span", { className: "al-t" }, text),
        React.createElement("time", null, time));
}
function RecommendationCard({ r, open, toggle }) {
    const { t } = useI18n();
    const Icon = ICONS[r.res];
    const pay = r.cost / r.save;
    const priLabel = { high: t('high'), medium: t('medium'), low: t('low') }[r.pri];
    return (React.createElement("article", { className: "card rec" },
        React.createElement("div", { className: 'rec-ic ' + r.res },
            React.createElement(Icon, { size: 22 })),
        React.createElement("div", { className: "rec-main" },
            React.createElement("div", { className: "rec-top" },
                React.createElement("h3", null, t(`r${r.id}i`)),
                React.createElement("span", { className: 'badge ' + r.pri }, priLabel)),
            React.createElement("p", { className: "muted" }, t(r.res)),
            React.createElement("div", { className: "rec-metrics" },
                React.createElement("span", null,
                    "$ ",
                    fmt(r.cost)),
                React.createElement("span", { className: "save" },
                    "$ ",
                    fmt(r.save),
                    t('perYr')),
                React.createElement("span", null,
                    pay.toFixed(1),
                    " ",
                    t('years')),
                React.createElement("span", null,
                    r.co2,
                    " ",
                    t('co2u').split(' /')[0])),
            open && React.createElement("div", { className: "rec-detail" },
                React.createElement("p", null,
                    React.createElement("b", null,
                        t('issue'),
                        ":"),
                    " ",
                    t(`r${r.id}i`)),
                React.createElement("p", null,
                    React.createElement("b", null,
                        t('action'),
                        ":"),
                    " ",
                    t(`r${r.id}a`)),
                React.createElement("p", null,
                    React.createElement("b", null,
                        t('benefit'),
                        ":"),
                    " ",
                    r.co2,
                    " ",
                    t('co2u')),
                React.createElement("p", { className: "muted" }, t('payTip')))),
        React.createElement("button", { className: "btn", onClick: toggle, "aria-expanded": open }, open ? t('hide') : t('details'))));
}
const RES = ['electricity', 'water', 'fuel'];
const useMonths = (lang) => { const f = new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en', { month: 'short' }); return Array.from({ length: 12 }, (_, i) => f.format(new Date(2025, i, 1))); };
const PeriodSelect = ({ value, onChange }) => { const { t } = useI18n(); return React.createElement("label", { className: "field inline" },
    React.createElement("span", { className: "sr" }, t('period')),
    React.createElement("select", { value: value, onChange: (e) => onChange(+e.target.value) },
        React.createElement("option", { value: 6 }, t('p6')),
        React.createElement("option", { value: 12 }, t('p12')))); };
const scaled = (res, fac, n) => SERIES[res].slice(-n).map((v) => v * FACILITIES[fac]);
const Demo = () => { const { t } = useI18n(); return React.createElement("div", { className: "demo" },
    React.createElement(Leaf, { size: 16 }),
    t('demo')); };
function Overview({ fac, period, setPeriod, go }) {
    const { t, lang } = useI18n();
    const months = useMonths(lang).slice(-period);
    const kpi = RES.map((r) => { const s = SERIES[r].map((v) => v * FACILITIES[fac] * 1000); const l = s.at(-1), p = s.at(-2); return { r, l, change: ((l - p) / p) * 100, spark: s.slice(-6) }; });
    const save = RECS.reduce((a, r) => a + r.save, 0) * FACILITIES[fac];
    const data = { labels: months, datasets: RES.map((r) => ({ label: t(r), data: scaled(r, fac, period), borderColor: COLORS[r], backgroundColor: COLORS[r], tension: 0.35, pointRadius: 3 })) };
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHead, { title: t('hello'), sub: `${t(fac)} · ${t('helloSub')}` },
            React.createElement(PeriodSelect, { value: period, onChange: setPeriod })),
        React.createElement("div", { className: "kpis" },
            kpi.map((k) => React.createElement(StatCard, { key: k.r, res: k.r, label: t(k.r), value: fmt(k.l), unit: t(UNIT[k.r]), change: k.change, series: k.spark })),
            React.createElement(StatCard, { res: "savings", label: t('savings'), value: '$' + fmt(save), unit: "", series: [3, 4, 4.5, 6, 5.5, 8] })),
        React.createElement("div", { className: "grid-main" },
            React.createElement(ChartCard, { title: t('trends'), h: 300 },
                React.createElement(Line, { data: data, options: chartOpts(lang, 'k') })),
            React.createElement("div", { className: "stack" },
                React.createElement("section", { className: "card insight" },
                    React.createElement("div", { className: "card-head" },
                        React.createElement(Lightbulb, { color: "#2F8DEB" }),
                        React.createElement("h2", null, t('insight'))),
                    React.createElement("p", null, t('insightText')),
                    React.createElement("button", { className: "btn primary", onClick: () => go('recs') },
                        t('viewRec'),
                        " ",
                        React.createElement(ArrowRight, { size: 16, className: "flip" }))),
                React.createElement("section", { className: "card" },
                    React.createElement("div", { className: "card-head" },
                        React.createElement("h2", null, t('alerts')),
                        React.createElement("button", { className: "link", onClick: () => go('recs') }, t('viewAll'))),
                    React.createElement("ul", { className: "alerts" }, ALERTS.map((a) => React.createElement(AlertCard, { key: a.k, a: a, text: t(a.k), time: t('hAgo').replace('{n}', a.h) })))))),
        React.createElement(Demo, null)));
}
function Analytics({ fac, setFac, period, setPeriod }) {
    const { t, lang } = useI18n();
    const [entries, setEntries] = useState(() => {
    try {
        const saved = JSON.parse(
            localStorage.getItem('ecosense-consumption') || '[]'
        );
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
});
    const [res, setRes] = useState('electricity');
    
const actualEntries = entries.filter(entry =>
    entry.facility === fac &&
    ['electricity', 'water', 'fuel'].includes(entry.resource)
);

const actualTotals = {
    electricity: 0,
    water: 0,
    fuel: 0
};

actualEntries.forEach(entry => {
    actualTotals[entry.resource] += Number(entry.quantity) || 0;
});
const hasActualData = actualEntries.some(entry => entry.resource === res);
const selectedResourceTotal = actualTotals[res];

    const months = useMonths(lang).slice(-period);
    const f = FACILITIES[fac], d = DEPTS[res], total = d.reduce((a, x) => a + x[1], 0);
    
const bar = {
    labels: hasActualData
        ? [t(res)]
        : d.map(x => t(x[0])),
    datasets: [{
        label: t(res),
        data: hasActualData
            ? [selectedResourceTotal]
            : d.map(x => x[1] * f),
        backgroundColor: COLORS[res],
        borderRadius: 6
    }]
};

    
const cost = {
    labels: hasActualData ? [t(res)] : months,
    datasets: hasActualData
        ? [{
            label: t(res),
            data: [selectedResourceTotal * PRICE[res]],
            borderColor: COLORS[res],
            backgroundColor: COLORS[res],
            tension: 0.35
        }]
        : RES.map(r => ({
            label: t(r),
            data: scaled(r, fac, period).map(v => v * PRICE[r]),
            borderColor: COLORS[r],
            backgroundColor: COLORS[r],
            tension: 0.35,
            hidden: false
        }))
};

    return (React.createElement(React.Fragment, null,
        React.createElement(PageHead, { title: t('anTitle'), sub: t('anSub') }),
        
!hasActualData && React.createElement(
    'p',
    { className: 'muted', role: 'status' },
    lang === 'ar'
        ? 'لا توجد بيانات استهلاك فعلية لهذه المنشأة. المعروض حاليًا بيانات تجريبية.'
        : 'No actual consumption records for this facility. Demo data is being shown.'
),

        React.createElement("div", { className: "filters card" },
            React.createElement("label", { className: "field" },
                React.createElement("span", null, t('facility')),
                React.createElement("select", { value: fac, onChange: (e) => setFac(e.target.value) }, ['f1', 'f2', 'f3'].map((x) => React.createElement("option", { key: x, value: x }, t(x))))),
            React.createElement("label", { className: "field" },
                React.createElement("span", null, t('period')),
                React.createElement(PeriodSelect, { value: period, onChange: setPeriod })),
            React.createElement("div", { className: "seg", role: "group", "aria-label": t('resource') }, RES.map((r) => React.createElement("button", { key: r, className: res === r ? 'on' : '', onClick: () => setRes(r) }, t(r))))),
        React.createElement("div", { className: "grid-2" },
            React.createElement(ChartCard, { title: `${t('deptTitle')} — ${t(res)}` },
                React.createElement(Bar, { data: bar, options: chartOpts(lang, t(UNIT[res]) + ' k') })),
            React.createElement(ChartCard, { title: `${t('costTitle')} ($k)` },
                React.createElement(Line, { data: cost, options: chartOpts(lang, '$k') }))),
        React.createElement("section", { className: "card" },
            React.createElement("div", { className: "card-head" },
                React.createElement("h2", null, t('drivers'))),
            React.createElement("div", { className: "table-wrap" },
                React.createElement("table", null,
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, t('rank')),
                            React.createElement("th", null, t('source')),
                            React.createElement("th", null, t('share')),
                            React.createElement("th", null, t('cost')))),
      React.createElement("tbody", null,
hasActualData
? actualEntries
.filter(entry => entry.resource === res)
.map((entry, i) =>
React.createElement("tr", { key: entry.id },
React.createElement("td", null, i + 1),
React.createElement("td", null, entry.date),
React.createElement("td", null,
React.createElement("div", { className: "bar-row" },
React.createElement("div", { className: "meter" },
React.createElement("i", {
style: {

width: `${selectedResourceTotal > 0 ? Number(entry.quantity) / selectedResourceTotal * 100 : 0}%`,

background: COLORS[res]
}
})
),
React.createElement("b", null,

`${selectedResourceTotal > 0 ? Math.round(Number(entry.quantity) / selectedResourceTotal * 100) : 0}%`

)
)
),
React.createElement("td", null,
fmt(Number(entry.quantity) * PRICE[res])
)
)
)
: React.createElement("tr", null,
React.createElement("td", {
colSpan: 4,
style: { textAlign: "center" }


}, lang === "ar"
    ? "لا توجد بيانات فعلية لهذا المورد."
    : "No actual data for this resource.")
                    )
                )
            )
        )
    )
    )
);
}
   

function DataEntry({ fac }) {
    const { t, lang } = useI18n();
    const ar = lang === 'ar';

    const [resource, setResource] = useState('electricity');
    const [quantity, setQuantity] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [entryPeriod, setEntryPeriod] = useState('daily');
    const [message, setMessage] = useState('');

    const [entries, setEntries] = useState(() => {
        try {
            const saved = JSON.parse(
                localStorage.getItem('ecosense-consumption') || '[]'
            );
            return Array.isArray(saved) ? saved : [];
        } catch {
            return [];
        }
    });

    const filteredEntries = entries
        .filter(entry =>
            entry.resource === resource && entry.facility === fac
        )
        .sort((a, b) => b.date.localeCompare(a.date));

    const saveEntry = (e) => {
        e.preventDefault();
        setMessage('');

        const amount = Number(quantity);

        if (!Number.isFinite(amount) || amount <= 0 || !date) {
            setMessage(ar
                ? 'أدخلي كمية أكبر من صفر واختاري التاريخ.'
                : 'Enter a quantity greater than zero and select a date.');
            return;
        }

        const entry = {
            id: Date.now(),
            facility: fac,
            resource,
            quantity: amount,
            date,
            period: entryPeriod
        };

        const updated = [...entries, entry];

        setEntries(updated);
        localStorage.setItem(
            'ecosense-consumption',
            JSON.stringify(updated)
        );

        setQuantity('');
        setMessage(ar
            ? 'تم حفظ سجل الاستهلاك.'
            : 'Consumption record saved.');
    };

    const deleteEntry = (id) => {
        const updated = entries.filter(entry => entry.id !== id);
        setEntries(updated);
        localStorage.setItem(
            'ecosense-consumption',
            JSON.stringify(updated)
        );
    };

    return React.createElement(
        React.Fragment,
        null,

        React.createElement(PageHead, {
            title: ar ? 'إدخال بيانات الاستهلاك' : 'Consumption Data Entry',
            sub: ar
                ? 'سجّلي الاستهلاك الفعلي للمنشأة.'
                : 'Record your facility’s resource consumption.'
        }),

        React.createElement(
            'form',
            {
                className: 'card form narrow',
                onSubmit: saveEntry
            },

            React.createElement('label', { className: 'field' },
                React.createElement('span', null, ar ? 'المورد' : 'Resource'),
                React.createElement('select', {
                    value: resource,
                    onChange: e => {
                        setResource(e.target.value);
                        setMessage('');
                    }
                },
                    RES.map(r => React.createElement(
                        'option', { key: r, value: r }, t(r)
                    ))
                )
            ),

            React.createElement('label', { className: 'field' },
                React.createElement('span', null, ar ? 'الكمية' : 'Quantity'),
                React.createElement('input', {
                    type: 'number',
                    min: '0',
                    step: 'any',
                    value: quantity,
                    onChange: e => setQuantity(e.target.value),
                    placeholder: ar ? 'أدخلي الكمية' : 'Enter quantity',
                    required: true
                }),
                React.createElement('small', { className: 'muted' },
                    ar ? 'الوحدة: ' : 'Unit: ',
                    t(UNIT[resource])
                )
            ),

            React.createElement('label', { className: 'field' },
                React.createElement('span', null, ar ? 'تاريخ السجل' : 'Record date'),
                React.createElement('input', {
                    type: 'date',
                    value: date,
                    onChange: e => setDate(e.target.value),
                    required: true
                })
            ),

            React.createElement('label', { className: 'field' },
                React.createElement('span', null, ar ? 'الفترة' : 'Period'),
                React.createElement('select', {
                    value: entryPeriod,
                    onChange: e => setEntryPeriod(e.target.value)
                },
                    [
                        ['daily', ar ? 'يومي' : 'Daily'],
                        ['weekly', ar ? 'أسبوعي' : 'Weekly'],
                        ['monthly', ar ? 'شهري' : 'Monthly'],
                        ['yearly', ar ? 'سنوي' : 'Yearly']
                    ].map(([value, label]) => React.createElement(
                        'option', { key: value, value }, label
                    ))
                )
            ),

            React.createElement('button', {
                type: 'submit',
                className: 'btn primary'
            }, ar ? 'حفظ سجل الاستهلاك' : 'Save Consumption Record'),

            message && React.createElement('p', {
                className: 'save-message',
                role: 'status'
            }, message)
        ),

        React.createElement('section', { className: 'card' },
            React.createElement('div', { className: 'card-head' },
                React.createElement('h2', null,
                    ar ? 'السجلات السابقة' : 'Previous Records'
                ),
                React.createElement('span', { className: 'muted' },
                    `${filteredEntries.length} ${ar ? 'سجل' : 'records'}`
                )
            ),

            filteredEntries.length === 0
                ? React.createElement('p', { className: 'muted' },
                    ar
                        ? 'لا توجد سجلات لهذا المورد في المنشأة المختارة.'
                        : 'No records for this resource at the selected facility.'
                )
                : React.createElement('div', { className: 'table-wrap' },
                    React.createElement('table', null,
                        React.createElement('thead', null,
                            React.createElement('tr', null,
                                            React.createElement('th', null, ar ? 'التاريخ' : 'Date'),
                                React.createElement('th', null, ar ? 'الكمية' : 'Quantity'),
                                React.createElement('th', null, ar ? 'الفترة' : 'Period'),
                                React.createElement('th', null, ar ? 'إجراء' : 'Action')
                            )
                        ),
                        React.createElement('tbody', null,
                            filteredEntries.map(entry =>
                                React.createElement('tr', { key: entry.id },
                                    React.createElement('td', null, entry.date),
                                    React.createElement('td', null,
                                        `${entry.quantity} ${t(UNIT[entry.resource])}`
                                    ),
                                    React.createElement('td', null,
                                        ({
                                            daily: ar ? 'يومي' : 'Daily',
                                            weekly: ar ? 'أسبوعي' : 'Weekly',
                                            monthly: ar ? 'شهري' : 'Monthly',
                                            yearly: ar ? 'سنوي' : 'Yearly'
                                        })[entry.period] || entry.period
                                    ),
                                    React.createElement('td', null,
                                        React.createElement('button', {
                                            type: 'button',
                                            className: 'btn',
                                            onClick: () => {
                                                if (window.confirm(
                                                    ar ? 'هل تريدين حذف هذا السجل؟' : 'Delete this record?'
                                                )) {
                                                    deleteEntry(entry.id);
                                                }
                                            }
                                        }, ar ? 'حذف' : 'Delete')
                                    )
                                )
                            )
                        )
                    )
                )
        )
    );
}

function Simulator() {
    const { t, lang } = useI18n();
    const [sc, setSc] = useState('sc1');
    const [v, setV] = useState({ ...SCENARIOS.sc1, price: PRICE.electricity });
    const pick = (k) => { setSc(k); setV({ ...SCENARIOS[k], price: PRICE[SCENARIOS[k].res] }); };
    const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
    const n = (x) => parseFloat(x);
    const err = { cost: !(n(v.cost) > 0), red: !(n(v.red) >= 1 && n(v.red) <= 100), use: !(n(v.use) > 0), price: !(n(v.price) > 0) };
    const bad = Object.values(err).some(Boolean);
    const base = n(v.use) * n(v.price), save = base * n(v.red) / 100, red = n(v.use) * n(v.red) / 100, co2 = red * CO2[v.res] / 1000, pay = save > 0 ? n(v.cost) / save : null;
    const chart = { labels: [t('current'), t('projected')], datasets: [{ data: [base, base - save], backgroundColor: ['#1E3A8A', COLORS.savings], borderRadius: 6 }] };
    const F = ({ k, label, tip, step }) => React.createElement("label", { className: "field" },
        React.createElement("span", null,
            label,
            tip && React.createElement(Tip, { text: tip })),
        React.createElement("input", { type: "number", min: "0", step: step || 'any', value: v[k], onChange: set(k), "aria-invalid": err[k] }),
        err[k] && React.createElement("em", { className: "err" }, k === 'red' ? t('errPct') : t('errNum')));
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHead, { title: t('simTitle'), sub: t('simSub') }),
        React.createElement("div", { className: "grid-2 sim" },
            React.createElement("section", { className: "card form" },
                React.createElement("h2", null, t('scenario')),
                React.createElement("label", { className: "field" },
                    React.createElement("span", null, t('scenario')),
                    React.createElement("select", { value: sc, onChange: (e) => pick(e.target.value) }, Object.keys(SCENARIOS).map((k) => React.createElement("option", { key: k, value: k }, t(k))))),
                React.createElement(F, { k: "cost", label: t('implCost') }),
                React.createElement(F, { k: "red", label: t('reduction') }),
                React.createElement("input", { type: "range", min: "1", max: "100", value: n(v.red) || 1, onChange: set('red'), "aria-label": t('reduction') }),
                React.createElement(F, { k: "use", label: `${t('annualUse')} (${t(UNIT[v.res])})` }),
                React.createElement(F, { k: "price", label: `${t('unitPrice')} / ${t(UNIT[v.res])}` })),
            React.createElement("section", { className: "card results" },
                React.createElement("h2", null, t('results')),
                bad ? React.createElement("p", { className: "err" }, t('errNum')) : React.createElement("div", { className: "res-grid" },
                    React.createElement("div", { className: "res green" },
                        React.createElement("span", null, t('annSave')),
                        React.createElement("b", null,
                            "$",
                            fmt(save))),
                    React.createElement("div", { className: "res" },
                        React.createElement("span", null,
                            t('payback'),
                            " ",
                            React.createElement(Tip, { text: t('payTip') })),
                        React.createElement("b", null,
                            pay ? pay.toFixed(1) : t('noPay'),
                            " ",
                            t('years'))),
                    React.createElement("div", { className: "res" },
                        React.createElement("span", null, t('resRed')),
                        React.createElement("b", null,
                            fmt(red),
                            " ",
                            t(UNIT[v.res]))),
                    React.createElement("div", { className: "res green" },
                        React.createElement("span", null, t('co2')),
                        React.createElement("b", null,
                            co2.toFixed(1),
                            " ",
                            t('co2u')))),
                React.createElement("h3", null, t('compare')),
                React.createElement("div", { className: "chart", style: { height: 200 } }, !bad && React.createElement(Bar, { data: chart, options: { ...chartOpts(lang, '$'), plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => '$' + fmt(c.parsed.y) } } } } })),
                React.createElement("p", { className: "note" }, t('estNote'))))));
}
function Recommendations() {
    const { t } = useI18n();
    const [res, setRes] = useState('all');
    const [pri, setPri] = useState('all');
    const [open, setOpen] = useState(null);
    const list = RECS.filter((r) => (res === 'all' || r.res === res) && (pri === 'all' || r.pri === pri));
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHead, { title: t('recTitle'), sub: t('recSub') }),
        React.createElement("div", { className: "filters card" },
            React.createElement("div", { className: "seg" }, ['all', ...RES].map((r) => React.createElement("button", { key: r, className: res === r ? 'on' : '', onClick: () => setRes(r) }, t(r)))),
            React.createElement("div", { className: "seg" }, ['all', 'high', 'medium', 'low'].map((r) => React.createElement("button", { key: r, className: pri === r ? 'on' : '', onClick: () => setPri(r) }, t(r))))),
        React.createElement("div", { className: "stack" }, list.length ? list.map((r) => React.createElement(RecommendationCard, { key: r.id, r: r, open: open === r.id, toggle: () => setOpen(open === r.id ? null : r.id) })) : React.createElement("p", { className: "card" }, t('empty')))));
}
function Reports({ fac, period, setPeriod }) {
    const { t, lang } = useI18n();
    const months = useMonths(lang).slice(-period);
    const s = Object.fromEntries(RES.map((r) => [r, scaled(r, fac, period).map((v) => v * 1000)]));
    const sum = (a) => a.reduce((x, y) => x + y, 0);
    const cost = sum(RES.map((r) => sum(s[r]) * PRICE[r])), co2 = sum(RES.map((r) => sum(s[r]) * CO2[r])) / 1000, save = RECS.reduce((a, r) => a + r.save, 0) * FACILITIES[fac];
    const exportCsv = () => {
        const rows = [['Month', 'Electricity (kWh)', 'Water (m3)', 'Fuel (L)', 'Cost (USD)'], ...months.map((m, i) => [m, ...RES.map((r) => s[r][i].toFixed(0)), RES.reduce((a, r) => a + s[r][i] * PRICE[r], 0).toFixed(0)]), [], ['DEMO DATA - not measured results']];
        const url = URL.createObjectURL(new Blob(['\uFEFF' + rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8' }));
        const a = Object.assign(document.createElement('a'), { href: url, download: 'ecosense-report-demo.csv' });
        a.click();
        URL.revokeObjectURL(url);
    };
    const data = { labels: months, datasets: RES.map((r) => ({ label: t(r), data: s[r].map((v) => v / 1000), backgroundColor: COLORS[r], borderRadius: 3 })) };
    const tiles = [[t('totalCons'), `${fmt(sum(RES.map((r) => sum(s[r]))) / 1000)}k`, ''], [t('totalCost'), '$' + fmt(cost), ''], [t('potSave'), '$' + fmt(save), 'green'], [t('carbon'), fmt(co2, 1) + ' t', '']];
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHead, { title: t('repTitle'), sub: t('repSub') },
            React.createElement(PeriodSelect, { value: period, onChange: setPeriod }),
            React.createElement("button", { className: "btn primary", onClick: exportCsv },
                React.createElement(Download, { size: 16 }),
                " ",
                t('export'))),
        React.createElement("div", { className: "kpis four" }, tiles.map(([l, val, c]) => React.createElement("div", { key: l, className: 'card tile ' + c },
            React.createElement("span", null, l),
            React.createElement("b", null, val)))),
        React.createElement(ChartCard, { title: t('monthly'), h: 300 },
            React.createElement(Bar, { data: data, options: chartOpts(lang, 'k') })),
        React.createElement("p", { className: "note" }, t('sample'))));
}


function SettingsPage({ lang, setLang, fac, setFac }) {
    const { t } = useI18n();
    const ar = lang === 'ar';

    return React.createElement(
        React.Fragment,
        null,

        React.createElement(PageHead, {
            title: t('setTitle'),
            sub: t('setSub')
        }),

        React.createElement('div', {
            className: 'settings-layout'
        },

            React.createElement('section', {
                className: 'card settings-card'
            },

                React.createElement('div', {
                    className: 'settings-card-head'
                },
                    React.createElement('div', {
                        className: 'settings-icon'
                    }, '⚙'),

                    React.createElement('div', null,
                        React.createElement('h2', null,
                            ar ? 'التفضيلات العامة' : 'General Preferences'
                        ),
                        React.createElement('p', {
                            className: 'muted'
                        },
                            ar
                                ? 'خصصي تجربة استخدام EcoSense.'
                                : 'Customize your EcoSense experience.'
                        )
                    )
                ),

                React.createElement('div', {
                    className: 'settings-divider'
                }),

                React.createElement('label', {
                    className: 'field settings-field'
                },
                    React.createElement('span', null,
                        '🌐  ', t('language')
                    ),
                    React.createElement('select', {
                        value: lang,
                        onChange: e => setLang(e.target.value)
                    },
                        React.createElement('option', {
                            value: 'en'
                        }, 'English'),
                        React.createElement('option', {
                            value: 'ar'
                        }, 'العربية')
                    ),
                    React.createElement('small', {
                        className: 'muted'
                    },
                        ar
                            ? 'اختاري لغة عرض الموقع.'
                            : 'Choose your preferred display language.'
                    )
                ),

                React.createElement('label', {
                    className: 'field settings-field'
                },
                    React.createElement('span', null,
                        '🏢  ', t('defFac')
                    ),
                    React.createElement('select', {
                        value: fac,
                        onChange: e => setFac(e.target.value)
                    },
                        ['f1', 'f2', 'f3'].map(x =>
                            React.createElement('option', {
                                key: x,
                                value: x
                            }, t(x))
                        )
                    ),
                    React.createElement('small', {
                        className: 'muted'
                    },
                        ar
                            ? 'اختاري المنشأة الافتراضية لعرض بياناتها.'
                            : 'Choose the default facility for your dashboard.'
                    )
                )
            )
        )
    );
}


function ProfilePage({ profile, setProfile, onLogout }) {
    const { t } = useI18n();
    const [draft, setDraft] = useState({ ...profile });
    const [saved, setSaved] = useState(false);

    const updateField = (key, value) => {
        setDraft(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const saveProfile = (e) => {
        e.preventDefault();
        setProfile(draft);
        localStorage.setItem('ecosense-profile', JSON.stringify(draft));
        setSaved(true);
    };

    return React.createElement(React.Fragment, null,
        React.createElement(PageHead, {
            title: t('profile'),
            sub: t('editProfile')
        }),
        React.createElement("form", {
            className: "card form narrow profile-card",
            onSubmit: saveProfile
        },
            React.createElement("div", {
                className: "profile-avatar"
            }, (draft.fullName || "E").charAt(0).toUpperCase()),

            ...[
                ['fullName', 'fullName', 'text'],
                ['email', 'email', 'email'],
                ['company', 'company', 'text'],
                ['role', 'role', 'text']
            ].map(([key, label, type]) =>
                React.createElement("label", {
                    className: "field",
                    key
                },
                    React.createElement("span", null, t(label)),
                    React.createElement("input", {
                        type,
                        value: draft[key] || '',
                        onChange: e => updateField(key, e.target.value),
                        required: true
                    })
                )
            ),

            React.createElement("button", {
                className: "btn primary",
                type: "submit"
            }, t('saveProfile')),

            saved && React.createElement("p", {
                className: "save-message",
                role: "status"
            }, t('profileSaved')),
            React.createElement("button", {
type: "button",
className: "btn",
onClick: () => {
const confirmed = window.confirm(
"Are you sure you want to log out?"
);

    if (confirmed) {
        onLogout();
    }
}

}, "Log Out")
        )
    );
}
function LoginPage({ onLogin }) {
const [mode, setMode] = useState('login');
const [fullName, setFullName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState('');

const isSignup = mode === 'signup';

const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignup && password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
    }

    onLogin();
};

const changeMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setPassword('');
    setConfirmPassword('');
};

return React.createElement(
    "div",
    { className: "login-page" },

    React.createElement(
        "section",
        { className: "login-visual" },
        React.createElement("div", { className: "login-brand" },
            React.createElement("span", { className: "login-brand-icon" }, "E"),
            React.createElement("span", null, "EcoSense")
        ),
        React.createElement("div", { className: "login-visual-content" },
            React.createElement("span", { className: "login-eyebrow" },
                "SMART SUSTAINABILITY"
            ),
            React.createElement("h1", null,
                "A smarter future starts with better choices."
            ),
            React.createElement("p", null,
                "Monitor resources, understand your impact, and discover opportunities for a greener future."
            ),
            React.createElement("div", { className: "login-stat-row" },
                React.createElement("div", null,
                    React.createElement("strong", null, "01"),
                    React.createElement("span", null, "Monitor")
                ),
                React.createElement("div", null,
                    React.createElement("strong", null, "02"),
                    React.createElement("span", null, "Analyze")
                ),
                React.createElement("div", null,
                    React.createElement("strong", null, "03"),
                    React.createElement("span", null, "Improve")
                )
            )
        ),
        React.createElement("p", { className: "login-visual-footer" },
            "Building a more sustainable tomorrow."
        )
    ),

    React.createElement(
        "section",
        { className: "login-form-side" },
        React.createElement("form", {
            className: "login-card",
            onSubmit: handleSubmit
        },
            React.createElement("div", { className: "login-mobile-brand" },
                React.createElement("span", { className: "login-brand-icon" }, "E"),
                React.createElement("span", null, "EcoSense")
            ),

            React.createElement("span", { className: "login-welcome" },
                isSignup ? "GET STARTED" : "WELCOME BACK"
            ),
            React.createElement("h2", null,
                isSignup ? "Create your account" : "Sign in to EcoSense"
            ),
            React.createElement("p", { className: "login-description" },
                isSignup
                    ? "Create an account to explore your sustainability dashboard."
                    : "Enter your details to access your sustainability dashboard."
            ),

            React.createElement("div", { className: "login-mode-switch" },
                React.createElement("button", {
                    type: "button",
                    className: !isSignup ? "active" : "",
                    onClick: () => changeMode('login')
                }, "Sign In"),
                React.createElement("button", {
                    type: "button",
                    className: isSignup ? "active" : "",
                    onClick: () => changeMode('signup')
                }, "Create Account")
            ),

            isSignup && React.createElement(
                React.Fragment,
                null,
                React.createElement("label", {
                    className: "login-label",
                    htmlFor: "signup-name"
                }, "Full name"),
                React.createElement("input", {
                    id: "signup-name",
                    className: "login-input",
                    type: "text",
                    placeholder: "Your full name",
                    autoComplete: "name",
                    value: fullName,
                    onChange: e => setFullName(e.target.value),
                    required: true,
                    minLength: 2
                })
            ),

            React.createElement("label", {
                className: "login-label",
                htmlFor: "login-email"
            }, "Email address"),
            React.createElement("input", {
                id: "login-email",
                className: "login-input",
                type: "email",
                placeholder: "you@example.com",
                autoComplete: "email",
                value: email,
                onChange: e => setEmail(e.target.value),
                required: true
            }),

            React.createElement("label", {
                className: "login-label",
                htmlFor: "login-password"
            }, "Password"),
            React.createElement("div", { className: "login-password-wrap" },
                React.createElement("input", {
                    id: "login-password",
                    className: "login-input",
                    type: showPassword ? "text" : "password",
                    placeholder: isSignup ? "Create a strong password" : "Enter your password",
                    autoComplete: isSignup ? "new-password" : "current-password",
                    value: password,
                    onChange: e => setPassword(e.target.value),
                    minLength: isSignup ? 8 : undefined,
                    pattern: isSignup
                        ? "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}"
                        : undefined,
                    title: "Use at least 8 characters, uppercase and lowercase letters, a number, and a symbol.",
                    required: true
                }),
                React.createElement("button", {
                    type: "button",
                    className: "login-show-password",
                    onClick: () => setShowPassword(!showPassword)
                }, showPassword ? "Hide" : "Show")
            ),

            isSignup && React.createElement(
                React.Fragment,
                null,
                React.createElement("p", {
                    className: "login-password-hint"
                }, "Use 8+ characters with uppercase and lowercase letters, a number, and a symbol."),

                React.createElement("label", {
                    className: "login-label",
                    htmlFor: "confirm-password"
                }, "Confirm password"),
                React.createElement("input", {
                    id: "confirm-password",
                    className: "login-input",
                    type: showPassword ? "text" : "password",
                    placeholder: "Re-enter your password",
                    autoComplete: "new-password",
                    value: confirmPassword,
                    onChange: e => setConfirmPassword(e.target.value),
                    required: true
                })
            ),

            error && React.createElement("p", {
                className: "login-error",
                role: "alert"
            }, error),

            React.createElement("button", {
                type: "submit",
                className: "login-submit"
            }, isSignup ? "Create Account" : "Sign In",
                React.createElement("span", null, "→")
            ),

            React.createElement("p", { className: "login-demo-note" },
                "Demo frontend · No real account verification"
            )
        )
    )
);

}
function App() {
    const [lang, setLang] = useState('en');
    const [page, setPage] = useState('overview');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [fac, setFac] = useState(() => {
    return localStorage.getItem('ecosense-facility') || 'f1';
});
    const [period, setPeriod] = useState(12);
    useEffect(() => {
    localStorage.setItem('ecosense-facility', fac);
}, [fac]);
    
const [profile, setProfile] = useState(() => {
    try {
        return JSON.parse(
            localStorage.getItem('ecosense-profile')
        ) || {
            fullName: '',
            email: '',
            company: '',
            role: ''
        };
    } catch {
        return {
            fullName: '',
            email: '',
            company: '',
            role: ''
        };
    }
});

    useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; }, [lang]);
    const t = (k) => { var _a, _b; return (_b = (_a = dict[lang][k]) !== null && _a !== void 0 ? _a : dict.en[k]) !== null && _b !== void 0 ? _b : k; };
    const go = (p) => { setPage(p); window.scrollTo(0, 0); };
    if (!isLoggedIn) {
    return React.createElement(LoginPage, {
        onLogin: () => setIsLoggedIn(true)
    });
}
const views = {
    overview: React.createElement(Overview, {
        fac: fac,
        period: period,
        setPeriod: setPeriod,
        go: go
    }),
    dataEntry: React.createElement(DataEntry, { fac: fac }),

    analytics: React.createElement(Analytics, {
        fac: fac,
        setFac: setFac,
        period: period,
        setPeriod: setPeriod
    }),

    simulator: React.createElement(Simulator, null),

    recs: React.createElement(Recommendations, null),

    reports: React.createElement(Reports, {
        fac: fac,
        period: period,
        setPeriod: setPeriod
    }),

    settings: React.createElement(SettingsPage, {
        lang: lang,
        setLang: setLang,
        fac: fac,
        setFac: setFac
    }),

    profile: React.createElement(ProfilePage, {
profile: profile,
setProfile: setProfile,
onLogout: () => setIsLoggedIn(false)
})
};

return React.createElement(
    I18n.Provider,
    { value: { lang: lang, t: t } },
    React.createElement(
        "div",
        { className: "shell" },
        React.createElement(Sidebar, {
            page: page,
            go: go
        }),
        React.createElement(
            "div",
            { className: "content" },
            React.createElement(Header, {
                fac: fac,
                setFac: setFac,
                lang: lang,
                setLang: setLang,
                setPage: go
            }),
            React.createElement("main", null, views[page])
        ),
        React.createElement(BottomNav, {
            page: page,
            go: go
        })
    )
);
}

ReactDOM.createRoot(document.getElementById('root')).render(
    React.createElement(App, null)
);    
