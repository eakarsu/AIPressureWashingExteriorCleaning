-- ============================================================
-- AI Pressure Washing & Exterior Cleaning - Database Schema
-- ============================================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS ai_logs CASCADE;
DROP TABLE IF EXISTS time_entries CASCADE;
DROP TABLE IF EXISTS route_sheets CASCADE;
DROP TABLE IF EXISTS marketing_campaigns CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS training_records CASCADE;
DROP TABLE IF EXISTS environmental_compliance CASCADE;
DROP TABLE IF EXISTS insurance_certificates CASCADE;
DROP TABLE IF EXISTS safety_checklists CASCADE;
DROP TABLE IF EXISTS maintenance_logs CASCADE;
DROP TABLE IF EXISTS fleet_vehicles CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS service_plans CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS chemicals CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS crew_members CASCADE;
DROP TABLE IF EXISTS crews CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- 1. USERS (Authentication & Authorization)
-- ============================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'technician',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 2. LOCATIONS (Multi-location support)
-- ============================================================
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    manager_id INTEGER REFERENCES users(id),
    service_radius_miles INTEGER DEFAULT 30,
    is_headquarters BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 3. SERVICES (Service Catalog)
-- ============================================================
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2),
    price_unit VARCHAR(50) DEFAULT 'per_sqft',
    min_price DECIMAL(10, 2),
    estimated_duration_minutes INTEGER,
    requires_soft_wash BOOLEAN DEFAULT FALSE,
    requires_hot_water BOOLEAN DEFAULT FALSE,
    chemical_required BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 4. CUSTOMERS
-- ============================================================
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    alt_phone VARCHAR(20),
    customer_type VARCHAR(50) DEFAULT 'residential',
    company_name VARCHAR(200),
    billing_address_line1 VARCHAR(255),
    billing_address_line2 VARCHAR(255),
    billing_city VARCHAR(100),
    billing_state VARCHAR(50),
    billing_zip VARCHAR(20),
    referral_source VARCHAR(100),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 5. PROPERTIES (Customer Property Profiles)
-- ============================================================
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    property_name VARCHAR(200),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    property_type VARCHAR(50) DEFAULT 'residential',
    square_footage INTEGER,
    stories INTEGER DEFAULT 1,
    roof_type VARCHAR(100),
    siding_type VARCHAR(100),
    deck_material VARCHAR(100),
    driveway_sqft INTEGER,
    has_pool BOOLEAN DEFAULT FALSE,
    has_fence BOOLEAN DEFAULT FALSE,
    gate_code VARCHAR(50),
    special_instructions TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 6. QUOTES (Quoting & Estimation)
-- ============================================================
CREATE TABLE quotes (
    id SERIAL PRIMARY KEY,
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    property_id INTEGER REFERENCES properties(id),
    service_id INTEGER REFERENCES services(id),
    location_id INTEGER REFERENCES locations(id),
    prepared_by INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'draft',
    description TEXT,
    total_sqft INTEGER,
    unit_price DECIMAL(10, 2),
    subtotal DECIMAL(10, 2),
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2),
    valid_until DATE,
    notes TEXT,
    ai_suggested_price DECIMAL(10, 2),
    ai_confidence_score DECIMAL(5, 2),
    sent_at TIMESTAMP,
    accepted_at TIMESTAMP,
    declined_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 7. CREWS
-- ============================================================
CREATE TABLE crews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location_id INTEGER REFERENCES locations(id),
    lead_user_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active',
    specialty VARCHAR(100),
    max_members INTEGER DEFAULT 4,
    color_code VARCHAR(7),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 8. CREW MEMBERS
-- ============================================================
CREATE TABLE crew_members (
    id SERIAL PRIMARY KEY,
    crew_id INTEGER NOT NULL REFERENCES crews(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    role VARCHAR(50) DEFAULT 'member',
    joined_date DATE DEFAULT CURRENT_DATE,
    left_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 9. JOBS (Job Scheduling)
-- ============================================================
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    job_number VARCHAR(50) UNIQUE NOT NULL,
    quote_id INTEGER REFERENCES quotes(id),
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    property_id INTEGER REFERENCES properties(id),
    service_id INTEGER REFERENCES services(id),
    crew_id INTEGER REFERENCES crews(id),
    location_id INTEGER REFERENCES locations(id),
    assigned_to INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'scheduled',
    priority VARCHAR(20) DEFAULT 'normal',
    scheduled_date DATE,
    scheduled_time_start TIME,
    scheduled_time_end TIME,
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    estimated_duration_minutes INTEGER,
    actual_duration_minutes INTEGER,
    total_sqft INTEGER,
    amount DECIMAL(10, 2),
    weather_conditions VARCHAR(100),
    temperature_f INTEGER,
    notes TEXT,
    completion_notes TEXT,
    customer_signature_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 10. EQUIPMENT (Machines, Nozzles, Surface Cleaners)
-- ============================================================
CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    equipment_type VARCHAR(100),
    psi_rating INTEGER,
    gpm_rating DECIMAL(5, 2),
    fuel_type VARCHAR(50),
    purchase_date DATE,
    purchase_price DECIMAL(10, 2),
    current_value DECIMAL(10, 2),
    location_id INTEGER REFERENCES locations(id),
    assigned_crew_id INTEGER REFERENCES crews(id),
    status VARCHAR(50) DEFAULT 'available',
    condition_rating INTEGER DEFAULT 5,
    last_service_date DATE,
    next_service_date DATE,
    hours_used DECIMAL(10, 1) DEFAULT 0,
    notes TEXT,
    warranty_expiry DATE,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 11. CHEMICALS (Chemical Inventory & Mixing Ratios)
-- ============================================================
CREATE TABLE chemicals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    chemical_type VARCHAR(100),
    active_ingredient VARCHAR(200),
    concentration_percent DECIMAL(5, 2),
    sds_url TEXT,
    unit_of_measure VARCHAR(50) DEFAULT 'gallons',
    current_stock DECIMAL(10, 2) DEFAULT 0,
    reorder_level DECIMAL(10, 2) DEFAULT 5,
    cost_per_unit DECIMAL(10, 2),
    supplier VARCHAR(200),
    supplier_sku VARCHAR(100),
    mixing_ratio_chemical VARCHAR(50),
    mixing_ratio_water VARCHAR(50),
    downstream_ratio VARCHAR(50),
    xjet_ratio VARCHAR(50),
    recommended_surfaces TEXT,
    safety_notes TEXT,
    storage_requirements VARCHAR(200),
    shelf_life_months INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 12. PHOTOS (Before/After Documentation)
-- ============================================================
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES properties(id),
    uploaded_by INTEGER REFERENCES users(id),
    photo_type VARCHAR(50) NOT NULL DEFAULT 'before',
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    surface_type VARCHAR(100),
    tags TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    taken_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 13. SERVICE PLANS (Recurring Service Plans)
-- ============================================================
CREATE TABLE service_plans (
    id SERIAL PRIMARY KEY,
    plan_name VARCHAR(200) NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    property_id INTEGER REFERENCES properties(id),
    service_id INTEGER REFERENCES services(id),
    frequency VARCHAR(50) NOT NULL,
    price_per_visit DECIMAL(10, 2),
    annual_price DECIMAL(10, 2),
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    next_service_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    auto_renew BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 14. INVOICES
-- ============================================================
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    job_id INTEGER REFERENCES jobs(id),
    quote_id INTEGER REFERENCES quotes(id),
    location_id INTEGER REFERENCES locations(id),
    status VARCHAR(50) DEFAULT 'draft',
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    subtotal DECIMAL(10, 2),
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2),
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    payment_method VARCHAR(50),
    payment_date DATE,
    stripe_payment_id VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 15. INVOICE ITEMS
-- ============================================================
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id),
    description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10, 2) DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 16. CONTRACTS (Commercial Contracts)
-- ============================================================
CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    property_id INTEGER REFERENCES properties(id),
    location_id INTEGER REFERENCES locations(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    contract_type VARCHAR(50) DEFAULT 'annual',
    status VARCHAR(50) DEFAULT 'draft',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_amount DECIMAL(10, 2),
    annual_amount DECIMAL(10, 2),
    payment_terms VARCHAR(100) DEFAULT 'Net 30',
    scope_of_work TEXT,
    frequency VARCHAR(50),
    auto_renew BOOLEAN DEFAULT FALSE,
    signed_date DATE,
    signed_by VARCHAR(200),
    document_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 17. FLEET VEHICLES (Fleet & Trailer Tracking)
-- ============================================================
CREATE TABLE fleet_vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_type VARCHAR(50) NOT NULL,
    make VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    vin VARCHAR(50),
    license_plate VARCHAR(20),
    color VARCHAR(50),
    mileage INTEGER,
    fuel_type VARCHAR(50),
    assigned_crew_id INTEGER REFERENCES crews(id),
    location_id INTEGER REFERENCES locations(id),
    status VARCHAR(50) DEFAULT 'active',
    insurance_policy VARCHAR(100),
    insurance_expiry DATE,
    registration_expiry DATE,
    last_inspection DATE,
    next_inspection DATE,
    gps_tracker_id VARCHAR(100),
    notes TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 18. MAINTENANCE LOGS (Equipment Maintenance)
-- ============================================================
CREATE TABLE maintenance_logs (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
    vehicle_id INTEGER REFERENCES fleet_vehicles(id) ON DELETE CASCADE,
    performed_by INTEGER REFERENCES users(id),
    maintenance_type VARCHAR(100) NOT NULL,
    description TEXT,
    parts_replaced TEXT,
    cost DECIMAL(10, 2),
    vendor VARCHAR(200),
    hours_at_service DECIMAL(10, 1),
    mileage_at_service INTEGER,
    next_service_date DATE,
    next_service_hours DECIMAL(10, 1),
    status VARCHAR(50) DEFAULT 'completed',
    performed_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 19. SAFETY CHECKLISTS
-- ============================================================
CREATE TABLE safety_checklists (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id),
    crew_id INTEGER REFERENCES crews(id),
    completed_by INTEGER REFERENCES users(id),
    checklist_date DATE DEFAULT CURRENT_DATE,
    ppe_hard_hat BOOLEAN DEFAULT FALSE,
    ppe_safety_glasses BOOLEAN DEFAULT FALSE,
    ppe_gloves BOOLEAN DEFAULT FALSE,
    ppe_boots BOOLEAN DEFAULT FALSE,
    ppe_hearing_protection BOOLEAN DEFAULT FALSE,
    equipment_inspected BOOLEAN DEFAULT FALSE,
    hoses_inspected BOOLEAN DEFAULT FALSE,
    chemical_labels_checked BOOLEAN DEFAULT FALSE,
    sds_sheets_available BOOLEAN DEFAULT FALSE,
    area_secured BOOLEAN DEFAULT FALSE,
    windows_closed BOOLEAN DEFAULT FALSE,
    plants_covered BOOLEAN DEFAULT FALSE,
    vehicles_moved BOOLEAN DEFAULT FALSE,
    electrical_hazards_checked BOOLEAN DEFAULT FALSE,
    weather_appropriate BOOLEAN DEFAULT FALSE,
    notes TEXT,
    signature_url TEXT,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 20. INSURANCE CERTIFICATES
-- ============================================================
CREATE TABLE insurance_certificates (
    id SERIAL PRIMARY KEY,
    policy_type VARCHAR(100) NOT NULL,
    provider VARCHAR(200) NOT NULL,
    policy_number VARCHAR(100) NOT NULL,
    coverage_amount DECIMAL(12, 2),
    deductible DECIMAL(10, 2),
    premium_monthly DECIMAL(10, 2),
    premium_annual DECIMAL(10, 2),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    agent_name VARCHAR(200),
    agent_phone VARCHAR(20),
    agent_email VARCHAR(255),
    document_url TEXT,
    location_id INTEGER REFERENCES locations(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 21. ENVIRONMENTAL COMPLIANCE
-- ============================================================
CREATE TABLE environmental_compliance (
    id SERIAL PRIMARY KEY,
    compliance_type VARCHAR(100) NOT NULL,
    description TEXT,
    jurisdiction VARCHAR(200),
    permit_number VARCHAR(100),
    issuing_authority VARCHAR(200),
    status VARCHAR(50) DEFAULT 'compliant',
    effective_date DATE,
    expiry_date DATE,
    wastewater_method VARCHAR(200),
    reclaim_system BOOLEAN DEFAULT FALSE,
    berm_required BOOLEAN DEFAULT FALSE,
    chemical_disposal_method VARCHAR(200),
    document_url TEXT,
    location_id INTEGER REFERENCES locations(id),
    reviewed_by INTEGER REFERENCES users(id),
    last_audit_date DATE,
    next_audit_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 22. TRAINING RECORDS
-- ============================================================
CREATE TABLE training_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    training_type VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    provider VARCHAR(200),
    certification_number VARCHAR(100),
    completed_date DATE,
    expiry_date DATE,
    score DECIMAL(5, 2),
    passed BOOLEAN DEFAULT TRUE,
    document_url TEXT,
    hours DECIMAL(5, 1),
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 23. REFERRALS
-- ============================================================
CREATE TABLE referrals (
    id SERIAL PRIMARY KEY,
    referrer_customer_id INTEGER REFERENCES customers(id),
    referred_customer_id INTEGER REFERENCES customers(id),
    referral_code VARCHAR(50) UNIQUE,
    referrer_name VARCHAR(200),
    referred_name VARCHAR(200),
    referred_email VARCHAR(255),
    referred_phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'pending',
    reward_type VARCHAR(50) DEFAULT 'discount',
    reward_amount DECIMAL(10, 2),
    reward_issued BOOLEAN DEFAULT FALSE,
    reward_issued_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 24. BOOKINGS (Online Booking)
-- ============================================================
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    service_id INTEGER REFERENCES services(id),
    location_id INTEGER REFERENCES locations(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    preferred_date DATE,
    preferred_time VARCHAR(50),
    property_sqft INTEGER,
    description TEXT,
    source VARCHAR(50) DEFAULT 'website',
    status VARCHAR(50) DEFAULT 'pending',
    converted_to_quote_id INTEGER REFERENCES quotes(id),
    converted_to_job_id INTEGER REFERENCES jobs(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 25. REVIEWS
-- ============================================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    job_id INTEGER REFERENCES jobs(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 5),
    professionalism INTEGER CHECK (professionalism >= 1 AND professionalism <= 5),
    punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 5),
    value_for_money INTEGER CHECK (value_for_money >= 1 AND value_for_money <= 5),
    would_recommend BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    response TEXT,
    response_date TIMESTAMP,
    platform VARCHAR(50) DEFAULT 'internal',
    external_review_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 26. MARKETING CAMPAIGNS
-- ============================================================
CREATE TABLE marketing_campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    campaign_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    channel VARCHAR(100),
    target_audience VARCHAR(200),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10, 2),
    spent DECIMAL(10, 2) DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    leads_generated INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue_generated DECIMAL(10, 2) DEFAULT 0,
    roi_percent DECIMAL(7, 2),
    promo_code VARCHAR(50),
    discount_percent DECIMAL(5, 2),
    description TEXT,
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 27. ROUTE SHEETS (Daily Route Sheets)
-- ============================================================
CREATE TABLE route_sheets (
    id SERIAL PRIMARY KEY,
    route_date DATE NOT NULL,
    crew_id INTEGER NOT NULL REFERENCES crews(id),
    vehicle_id INTEGER REFERENCES fleet_vehicles(id),
    location_id INTEGER REFERENCES locations(id),
    status VARCHAR(50) DEFAULT 'planned',
    total_jobs INTEGER DEFAULT 0,
    total_estimated_hours DECIMAL(5, 1),
    total_actual_hours DECIMAL(5, 1),
    total_miles DECIMAL(7, 1),
    start_mileage INTEGER,
    end_mileage INTEGER,
    fuel_gallons DECIMAL(5, 1),
    job_ids INTEGER[],
    route_order INTEGER[],
    optimized_by_ai BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 28. TIME ENTRIES (Time Tracking)
-- ============================================================
CREATE TABLE time_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    job_id INTEGER REFERENCES jobs(id),
    crew_id INTEGER REFERENCES crews(id),
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    clock_in TIMESTAMP NOT NULL,
    clock_out TIMESTAMP,
    break_minutes INTEGER DEFAULT 0,
    total_hours DECIMAL(5, 2),
    entry_type VARCHAR(50) DEFAULT 'work',
    hourly_rate DECIMAL(8, 2),
    total_pay DECIMAL(10, 2),
    notes TEXT,
    gps_clock_in_lat DECIMAL(10, 7),
    gps_clock_in_lng DECIMAL(10, 7),
    gps_clock_out_lat DECIMAL(10, 7),
    gps_clock_out_lng DECIMAL(10, 7),
    approved_by INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 29. AI LOGS (Store AI Interaction Results)
-- ============================================================
CREATE TABLE ai_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    feature VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    input_data JSONB,
    output_data JSONB,
    model_used VARCHAR(100),
    tokens_used INTEGER,
    cost DECIMAL(10, 6),
    response_time_ms INTEGER,
    confidence_score DECIMAL(5, 2),
    was_accepted BOOLEAN,
    feedback VARCHAR(50),
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_location ON customers(location_id);
CREATE INDEX idx_properties_customer ON properties(customer_id);
CREATE INDEX idx_quotes_customer ON quotes(customer_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_jobs_customer ON jobs(customer_id);
CREATE INDEX idx_jobs_crew ON jobs(crew_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_scheduled_date ON jobs(scheduled_date);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_photos_job ON photos(job_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_time_entries_user ON time_entries(user_id);
CREATE INDEX idx_time_entries_date ON time_entries(entry_date);
CREATE INDEX idx_route_sheets_date ON route_sheets(route_date);
CREATE INDEX idx_ai_logs_feature ON ai_logs(feature);
CREATE INDEX idx_ai_logs_created ON ai_logs(created_at);
CREATE INDEX idx_maintenance_equipment ON maintenance_logs(equipment_id);
CREATE INDEX idx_maintenance_vehicle ON maintenance_logs(vehicle_id);
