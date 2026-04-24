const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('./db');

async function seed() {
  const client = await pool.connect();

  try {
    // Read and execute schema
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schemaSQL);
    console.log('Schema created successfully.');

    // ========================================================
    // 1. USERS
    // ========================================================
    const adminHash = await bcrypt.hash('admin123', 10);
    const userHash = await bcrypt.hash('password123', 10);

    const usersData = [
      ['admin@pressurewash.com', adminHash, 'Mike', 'Anderson', '(555) 100-0001', 'admin'],
      ['sarah@pressurewash.com', userHash, 'Sarah', 'Mitchell', '(555) 100-0002', 'manager'],
      ['james@pressurewash.com', userHash, 'James', 'Walker', '(555) 100-0003', 'manager'],
      ['carlos@pressurewash.com', userHash, 'Carlos', 'Rodriguez', '(555) 100-0004', 'crew_lead'],
      ['dave@pressurewash.com', userHash, 'Dave', 'Thompson', '(555) 100-0005', 'crew_lead'],
      ['marcus@pressurewash.com', userHash, 'Marcus', 'Johnson', '(555) 100-0006', 'crew_lead'],
      ['tyler@pressurewash.com', userHash, 'Tyler', 'Davis', '(555) 100-0007', 'technician'],
      ['ryan@pressurewash.com', userHash, 'Ryan', 'Martinez', '(555) 100-0008', 'technician'],
      ['kevin@pressurewash.com', userHash, 'Kevin', 'Brown', '(555) 100-0009', 'technician'],
      ['brian@pressurewash.com', userHash, 'Brian', 'Wilson', '(555) 100-0010', 'technician'],
      ['jason@pressurewash.com', userHash, 'Jason', 'Taylor', '(555) 100-0011', 'technician'],
      ['derek@pressurewash.com', userHash, 'Derek', 'Lee', '(555) 100-0012', 'technician'],
      ['chris@pressurewash.com', userHash, 'Chris', 'Garcia', '(555) 100-0013', 'technician'],
      ['matt@pressurewash.com', userHash, 'Matt', 'Hernandez', '(555) 100-0014', 'technician'],
      ['nick@pressurewash.com', userHash, 'Nick', 'Moore', '(555) 100-0015', 'sales'],
      ['lisa@pressurewash.com', userHash, 'Lisa', 'Clark', '(555) 100-0016', 'office'],
    ];

    for (const u of usersData) {
      await client.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES ($1,$2,$3,$4,$5,$6)`,
        u
      );
    }
    console.log('Users seeded.');

    // ========================================================
    // 2. LOCATIONS
    // ========================================================
    const locationsData = [
      ['Main HQ - Austin', '4500 Industrial Blvd', null, 'Austin', 'TX', '78745', '(555) 200-0001', 'info@pressurewash.com', 1, 40, true, 30.2500, -97.7500],
      ['North Austin Branch', '12010 Research Blvd', 'Suite 200', 'Austin', 'TX', '78759', '(555) 200-0002', 'north@pressurewash.com', 2, 25, false, 30.3950, -97.7420],
      ['San Antonio Office', '8820 Bandera Rd', null, 'San Antonio', 'TX', '78250', '(555) 200-0003', 'sa@pressurewash.com', 3, 35, false, 29.5150, -98.6200],
      ['Round Rock Branch', '2200 N Mays St', null, 'Round Rock', 'TX', '78664', '(555) 200-0004', 'rr@pressurewash.com', 2, 20, false, 30.5200, -97.6800],
      ['Georgetown Satellite', '900 Main St', null, 'Georgetown', 'TX', '78626', '(555) 200-0005', 'gt@pressurewash.com', null, 15, false, 30.6330, -97.6770],
      ['Cedar Park Office', '1500 Cypress Creek Rd', null, 'Cedar Park', 'TX', '78613', '(555) 200-0006', 'cp@pressurewash.com', null, 20, false, 30.5050, -97.8200],
      ['Pflugerville Hub', '700 FM 685', null, 'Pflugerville', 'TX', '78660', '(555) 200-0007', 'pf@pressurewash.com', null, 15, false, 30.4520, -97.6200],
      ['Kyle Branch', '200 Center St', null, 'Kyle', 'TX', '78640', '(555) 200-0008', 'kyle@pressurewash.com', null, 20, false, 29.9890, -97.8770],
      ['Buda Satellite', '300 Main St', null, 'Buda', 'TX', '78610', '(555) 200-0009', 'buda@pressurewash.com', null, 15, false, 30.0850, -97.8410],
      ['Lakeway Office', '1900 Lohmans Crossing', null, 'Lakeway', 'TX', '78734', '(555) 200-0010', 'lakeway@pressurewash.com', null, 15, false, 30.3640, -97.9800],
      ['Dripping Springs', '400 Mercer St', null, 'Dripping Springs', 'TX', '78620', '(555) 200-0011', 'ds@pressurewash.com', null, 15, false, 30.1900, -98.0870],
      ['New Braunfels Office', '1200 S Seguin Ave', null, 'New Braunfels', 'TX', '78130', '(555) 200-0012', 'nb@pressurewash.com', null, 25, false, 29.7030, -98.1240],
      ['Marble Falls Branch', '600 Hwy 281', null, 'Marble Falls', 'TX', '78654', '(555) 200-0013', 'mf@pressurewash.com', null, 20, false, 30.5780, -98.2750],
      ['Bastrop Satellite', '900 Main St', null, 'Bastrop', 'TX', '78602', '(555) 200-0014', 'bastrop@pressurewash.com', null, 15, false, 30.1100, -97.3150],
      ['Wimberley Office', '100 River Rd', null, 'Wimberley', 'TX', '78676', '(555) 200-0015', 'wimberley@pressurewash.com', null, 15, false, 29.9970, -98.0990],
    ];

    for (const l of locationsData) {
      await client.query(
        `INSERT INTO locations (name, address_line1, address_line2, city, state, zip_code, phone, email, manager_id, service_radius_miles, is_headquarters, latitude, longitude)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        l
      );
    }
    console.log('Locations seeded.');

    // ========================================================
    // 3. SERVICES
    // ========================================================
    const servicesData = [
      ['House Wash', 'house-wash', 'Residential', 'Full exterior soft wash for vinyl, hardie board, stucco, and brick homes. Removes dirt, mildew, algae, and cobwebs.', 0.15, 'per_sqft', 199, 120, true, false, true],
      ['Roof Soft Wash', 'roof-soft-wash', 'Residential', 'Low-pressure chemical treatment for asphalt shingles, tile, and metal roofs. Kills algae, moss, and black streaks.', 0.30, 'per_sqft', 299, 150, true, false, true],
      ['Concrete Cleaning', 'concrete-cleaning', 'Residential', 'High-pressure surface cleaning for driveways, sidewalks, patios, and garage floors.', 0.12, 'per_sqft', 149, 90, false, false, true],
      ['Deck & Fence Restoration', 'deck-fence-restoration', 'Residential', 'Cleaning and brightening of wood and composite decks, fences, and pergolas.', 0.50, 'per_sqft', 249, 180, true, false, true],
      ['Gutter Cleaning & Brightening', 'gutter-cleaning', 'Residential', 'Interior gutter cleanout plus exterior gutter face whitening and oxidation removal.', 2.00, 'per_linear_ft', 149, 120, false, false, true],
      ['Window Cleaning', 'window-cleaning', 'Residential', 'Interior and exterior window cleaning with pure water fed pole system.', 7.00, 'per_pane', 129, 120, false, false, false],
      ['Pool Deck & Enclosure', 'pool-deck-cleaning', 'Residential', 'Pressure washing pool decks, coping, and screen enclosure frames.', 0.15, 'per_sqft', 199, 90, false, false, true],
      ['Commercial Storefront', 'commercial-storefront', 'Commercial', 'Building exterior, sidewalk, and entrance cleaning for retail and office buildings.', 0.10, 'per_sqft', 299, 120, true, false, true],
      ['Restaurant & Kitchen Exhaust', 'restaurant-exhaust', 'Commercial', 'Hot water pressure washing of kitchen exhaust hoods, dumpster pads, and grease traps.', null, 'flat_rate', 399, 180, false, true, true],
      ['Parking Lot & Garage', 'parking-lot', 'Commercial', 'Large-area surface cleaning for parking lots, parking garages, and drive-throughs.', 0.06, 'per_sqft', 499, 240, false, true, true],
      ['Fleet Washing', 'fleet-washing', 'Commercial', 'Mobile fleet vehicle washing for trucks, vans, buses, and heavy equipment.', 35.00, 'per_vehicle', 250, 30, false, false, true],
      ['Graffiti Removal', 'graffiti-removal', 'Specialty', 'Chemical and pressure-based graffiti removal from concrete, brick, and painted surfaces.', null, 'flat_rate', 199, 60, false, true, true],
      ['Rust & Stain Removal', 'rust-stain-removal', 'Specialty', 'Targeted treatment and removal of rust, fertilizer, battery acid, and irrigation stains.', null, 'flat_rate', 99, 45, false, false, true],
      ['Soft Wash Paver Cleaning', 'paver-cleaning', 'Residential', 'Low-pressure cleaning of brick pavers, travertine, and natural stone with re-sanding.', 0.75, 'per_sqft', 349, 240, true, false, true],
      ['Commercial Building Wash', 'commercial-building-wash', 'Commercial', 'Multi-story building exterior wash for office complexes, HOAs, and apartment buildings.', 0.08, 'per_sqft', 799, 480, true, false, true],
      ['Solar Panel Cleaning', 'solar-panel-cleaning', 'Specialty', 'Deionized water cleaning of solar panels to maximize energy output.', 8.00, 'per_panel', 149, 60, false, false, false],
    ];

    for (const s of servicesData) {
      await client.query(
        `INSERT INTO services (name, slug, category, description, base_price, price_unit, min_price, estimated_duration_minutes, requires_soft_wash, requires_hot_water, chemical_required)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        s
      );
    }
    console.log('Services seeded.');

    // ========================================================
    // 4. CUSTOMERS
    // ========================================================
    const customersData = [
      ['John', 'Peterson', 'john.peterson@email.com', '(555) 301-1001', null, 'residential', null, '1234 Elm St', null, 'Austin', 'TX', '78745', 'Google', null, 1],
      ['Mary', 'Sullivan', 'mary.sullivan@email.com', '(555) 301-1002', null, 'residential', null, '5678 Oak Ave', null, 'Austin', 'TX', '78759', 'Referral', null, 1],
      ['Robert', 'Chen', 'robert.chen@email.com', '(555) 301-1003', null, 'residential', null, '910 Pine Dr', null, 'Round Rock', 'TX', '78664', 'Nextdoor', null, 4],
      ['Jennifer', 'Williams', 'jennifer.w@email.com', '(555) 301-1004', null, 'residential', null, '2345 Cedar Ln', null, 'Georgetown', 'TX', '78626', 'Facebook', null, 5],
      ['David', 'Martinez', 'david.m@email.com', '(555) 301-1005', null, 'residential', null, '6789 Birch Ct', null, 'Pflugerville', 'TX', '78660', 'Yelp', null, 7],
      ['Patricia', 'Thompson', 'pat.thompson@email.com', '(555) 301-1006', '(555) 301-1106', 'residential', null, '3456 Maple Way', null, 'Cedar Park', 'TX', '78613', 'Google', null, 6],
      ['Michael', 'Davis', 'michael.davis@email.com', '(555) 301-1007', null, 'residential', null, '7890 Walnut Blvd', null, 'Lakeway', 'TX', '78734', 'Yard sign', null, 10],
      ['Linda', 'Garcia', 'linda.garcia@email.com', '(555) 301-1008', null, 'residential', null, '1122 Pecan St', null, 'Kyle', 'TX', '78640', 'Thumbtack', null, 8],
      ['William', 'Brown', 'william.b@email.com', '(555) 301-1009', null, 'residential', null, '3344 Ash Rd', null, 'Buda', 'TX', '78610', 'Google', null, 9],
      ['Barbara', 'Wilson', 'barbara.w@email.com', '(555) 301-1010', null, 'residential', null, '5566 Spruce Ave', null, 'Austin', 'TX', '78745', 'Referral', null, 1],
      ['Thomas', 'Nakamura', 'tom.nakamura@email.com', '(555) 301-1011', null, 'commercial', 'Hill Country Property Mgmt', '100 Congress Ave', 'Suite 400', 'Austin', 'TX', '78701', 'Cold call', null, 1],
      ['Angela', 'Reeves', 'angela@texasretail.com', '(555) 301-1012', '(555) 301-1112', 'commercial', 'Texas Retail Partners', '2500 S Lamar Blvd', null, 'Austin', 'TX', '78704', 'Website', null, 1],
      ['Richard', 'Okonkwo', 'richard.o@email.com', '(555) 301-1013', null, 'commercial', 'Lone Star Restaurant Group', '800 E 6th St', null, 'Austin', 'TX', '78702', 'Referral', null, 1],
      ['Sandra', 'Lopez', 'sandra.l@apartmentco.com', '(555) 301-1014', null, 'commercial', 'Sunset Apartments LLC', '4400 Riverside Dr', null, 'Austin', 'TX', '78741', 'Google', null, 1],
      ['Charles', 'Kim', 'charles.k@email.com', '(555) 301-1015', null, 'commercial', 'Central Texas Auto Group', '9900 N IH-35', null, 'Austin', 'TX', '78753', 'Trade show', null, 2],
      ['Karen', 'Patel', 'karen.patel@email.com', '(555) 301-1016', null, 'residential', null, '780 Sunset Dr', null, 'Dripping Springs', 'TX', '78620', 'Instagram', null, 11],
    ];

    for (const c of customersData) {
      await client.query(
        `INSERT INTO customers (first_name, last_name, email, phone, alt_phone, customer_type, company_name, billing_address_line1, billing_address_line2, billing_city, billing_state, billing_zip, referral_source, notes, location_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
        c
      );
    }
    console.log('Customers seeded.');

    // ========================================================
    // 5. PROPERTIES
    // ========================================================
    const propertiesData = [
      [1, 'Peterson Residence', '1234 Elm St', null, 'Austin', 'TX', '78745', 'residential', 2400, 2, 'Asphalt shingle', 'Hardie board', null, 600, false, false, null, null],
      [2, 'Sullivan Home', '5678 Oak Ave', null, 'Austin', 'TX', '78759', 'residential', 3200, 2, 'Metal standing seam', 'Brick', 'Composite', 800, true, true, null, null],
      [3, 'Chen House', '910 Pine Dr', null, 'Round Rock', 'TX', '78664', 'residential', 1800, 1, 'Asphalt shingle', 'Vinyl siding', 'Pressure-treated wood', 450, false, true, '4521', null],
      [4, 'Williams Ranch Home', '2345 Cedar Ln', null, 'Georgetown', 'TX', '78626', 'residential', 4500, 2, 'Tile', 'Austin stone', 'Trex composite', 1200, true, true, '1234', 'Large dogs - call before entering'],
      [5, 'Martinez Residence', '6789 Birch Ct', null, 'Pflugerville', 'TX', '78660', 'residential', 2100, 1, 'Asphalt shingle', 'Brick/vinyl combo', null, 500, false, false, null, null],
      [6, 'Thompson Estate', '3456 Maple Way', null, 'Cedar Park', 'TX', '78613', 'residential', 5200, 3, 'Slate', 'Stone veneer', 'Ipe hardwood', 1500, true, true, '9876', 'Park on street, not driveway'],
      [7, 'Davis Lake House', '7890 Walnut Blvd', null, 'Lakeway', 'TX', '78734', 'residential', 3800, 2, 'Metal standing seam', 'Stucco', 'Cedar', 900, true, false, null, 'Steep driveway - careful with trailer'],
      [8, 'Garcia Home', '1122 Pecan St', null, 'Kyle', 'TX', '78640', 'residential', 1600, 1, 'Asphalt shingle', 'Vinyl siding', null, 400, false, false, null, null],
      [9, 'Brown House', '3344 Ash Rd', null, 'Buda', 'TX', '78610', 'residential', 2800, 2, 'Asphalt shingle', 'Hardie board', 'Pressure-treated wood', 700, false, true, null, null],
      [10, 'Wilson Place', '5566 Spruce Ave', null, 'Austin', 'TX', '78745', 'residential', 2200, 1, 'Asphalt shingle', 'Brick', null, 550, false, false, null, null],
      [11, 'Hill Country Plaza', '100 Congress Ave', 'Suite 400', 'Austin', 'TX', '78701', 'commercial', 25000, 3, 'Flat/TPO', 'Glass/concrete', null, 5000, false, false, null, 'After hours only - 7pm to 6am'],
      [12, 'Lamar Retail Center', '2500 S Lamar Blvd', null, 'Austin', 'TX', '78704', 'commercial', 18000, 1, 'Flat/membrane', 'Stucco/glass', null, 8000, false, false, null, 'Coordinate with tenant hours'],
      [13, 'Sixth Street Restaurants', '800 E 6th St', null, 'Austin', 'TX', '78702', 'commercial', 4500, 2, 'Flat', 'Brick/painted', null, 1500, false, false, null, 'Monday only - closed day'],
      [14, 'Sunset Apartments Complex', '4400 Riverside Dr', null, 'Austin', 'TX', '78741', 'commercial', 45000, 3, 'Flat/shingle mix', 'Stucco', null, 12000, true, false, null, '120 units, 8 buildings'],
      [15, 'Auto Dealership Campus', '9900 N IH-35', null, 'Austin', 'TX', '78753', 'commercial', 30000, 1, 'Metal', 'Glass/metal panel', null, 20000, false, false, null, 'Showroom windows last'],
      [16, 'Patel Hill Country Home', '780 Sunset Dr', null, 'Dripping Springs', 'TX', '78620', 'residential', 3600, 2, 'Metal standing seam', 'Limestone', 'Ipe hardwood', 1000, true, true, null, 'Well water - bring own water'],
    ];

    for (const p of propertiesData) {
      await client.query(
        `INSERT INTO properties (customer_id, property_name, address_line1, address_line2, city, state, zip_code, property_type, square_footage, stories, roof_type, siding_type, deck_material, driveway_sqft, has_pool, has_fence, gate_code, special_instructions)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
        p
      );
    }
    console.log('Properties seeded.');

    // ========================================================
    // 6. CREWS
    // ========================================================
    const crewsData = [
      ['Alpha Crew', 1, 4, 'active', 'Residential soft wash', 4, '#2196F3', null],
      ['Bravo Crew', 1, 5, 'active', 'Concrete & flatwork', 3, '#4CAF50', null],
      ['Charlie Crew', 1, 6, 'active', 'Commercial', 4, '#FF9800', null],
      ['Delta Crew', 3, 4, 'active', 'Residential general', 3, '#9C27B0', null],
      ['Echo Crew', 4, 5, 'active', 'Roof soft wash', 3, '#F44336', null],
      ['Foxtrot Crew', 2, 6, 'active', 'Fleet & large commercial', 4, '#00BCD4', null],
      ['Golf Crew', 1, null, 'active', 'Window cleaning', 2, '#CDDC39', null],
      ['Hotel Crew', 3, null, 'active', 'Residential general', 3, '#795548', null],
      ['India Crew', 1, null, 'standby', 'Overflow / weekend', 4, '#607D8B', null],
      ['Juliet Crew', 1, null, 'active', 'Deck & fence restoration', 3, '#E91E63', null],
      ['Kilo Crew', 4, null, 'active', 'Residential general', 3, '#3F51B5', null],
      ['Lima Crew', 2, null, 'active', 'Commercial / HOA', 4, '#009688', null],
      ['Mike Crew', 1, null, 'active', 'Hot water / grease', 3, '#FF5722', null],
      ['November Crew', 3, null, 'standby', 'Overflow', 3, '#8BC34A', null],
      ['Oscar Crew', 1, null, 'training', 'New hire training', 4, '#FFC107', null],
    ];

    for (const c of crewsData) {
      await client.query(
        `INSERT INTO crews (name, location_id, lead_user_id, status, specialty, max_members, color_code, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        c
      );
    }
    console.log('Crews seeded.');

    // ========================================================
    // 7. CREW MEMBERS
    // ========================================================
    const crewMembersData = [
      [1, 4, 'lead'], [1, 7, 'member'], [1, 8, 'member'],
      [2, 5, 'lead'], [2, 9, 'member'], [2, 10, 'member'],
      [3, 6, 'lead'], [3, 11, 'member'], [3, 12, 'member'], [3, 13, 'member'],
      [4, 4, 'lead'], [4, 14, 'member'],
      [5, 5, 'lead'], [5, 7, 'member'],
      [6, 6, 'lead'], [6, 8, 'member'],
    ];

    for (const cm of crewMembersData) {
      await client.query(
        `INSERT INTO crew_members (crew_id, user_id, role) VALUES ($1,$2,$3)`,
        cm
      );
    }
    console.log('Crew members seeded.');

    // ========================================================
    // 8. QUOTES
    // ========================================================
    const quotesData = [
      ['Q-2026-001', 1, 1, 1, 1, 1, 'accepted', 'Full house wash - 2-story hardie board', 2400, 0.15, 360.00, 0, 0, 8.25, 29.70, 389.70, '2026-04-15', 375.00, 92.5],
      ['Q-2026-002', 2, 2, 2, 1, 1, 'accepted', 'Roof soft wash - metal standing seam with algae', 3200, 0.30, 960.00, 10, 96.00, 8.25, 71.28, 935.28, '2026-04-15', 900.00, 88.0],
      ['Q-2026-003', 3, 3, 3, 1, 15, 'sent', 'Concrete driveway and sidewalks', 450, 0.12, 149.00, 0, 0, 8.25, 12.29, 161.29, '2026-04-20', 155.00, 91.0],
      ['Q-2026-004', 4, 4, 4, 1, 15, 'accepted', 'Deck restoration - composite Trex deck', 800, 0.50, 400.00, 0, 0, 8.25, 33.00, 433.00, '2026-04-20', 425.00, 85.0],
      ['Q-2026-005', 5, 5, 3, 1, 15, 'accepted', 'Driveway and patio cleaning', 500, 0.12, 149.00, 0, 0, 8.25, 12.29, 161.29, '2026-04-25', 149.00, 94.0],
      ['Q-2026-006', 6, 6, 1, 1, 15, 'sent', 'Full estate wash - 3 story stone veneer', 5200, 0.18, 936.00, 5, 46.80, 8.25, 73.38, 962.58, '2026-04-25', 950.00, 78.0],
      ['Q-2026-007', 7, 7, 5, 1, 15, 'accepted', 'Gutter cleaning and brightening - 200 LF', 200, 2.00, 400.00, 0, 0, 8.25, 33.00, 433.00, '2026-04-30', 400.00, 90.0],
      ['Q-2026-008', 11, 11, 8, 1, 15, 'accepted', 'Commercial building exterior - quarterly', 25000, 0.08, 2000.00, 15, 300.00, 8.25, 140.25, 1840.25, '2026-04-30', 1800.00, 82.0],
      ['Q-2026-009', 12, 12, 8, 1, 15, 'accepted', 'Retail center storefront and sidewalks', 18000, 0.10, 1800.00, 10, 180.00, 8.25, 133.65, 1753.65, '2026-04-30', 1700.00, 86.0],
      ['Q-2026-010', 13, 13, 9, 1, 15, 'sent', 'Restaurant exterior + dumpster pad - hot water', null, null, 599.00, 0, 0, 8.25, 49.42, 648.42, '2026-05-05', 599.00, 91.0],
      ['Q-2026-011', 14, 14, 15, 1, 15, 'draft', 'Full apartment complex wash - 8 buildings', 45000, 0.08, 3600.00, 20, 720.00, 8.25, 237.60, 3117.60, '2026-05-10', 3200.00, 75.0],
      ['Q-2026-012', 15, 15, 10, 2, 15, 'accepted', 'Auto dealership parking lot monthly', 20000, 0.06, 1200.00, 0, 0, 8.25, 99.00, 1299.00, '2026-05-10', 1200.00, 89.0],
      ['Q-2026-013', 8, 8, 1, 1, 15, 'accepted', 'House wash - single story vinyl', 1600, 0.15, 240.00, 0, 0, 8.25, 19.80, 259.80, '2026-05-15', 240.00, 95.0],
      ['Q-2026-014', 9, 9, 4, 1, 15, 'sent', 'Deck and fence staining', 700, 0.50, 350.00, 0, 0, 8.25, 28.88, 378.88, '2026-05-15', 350.00, 87.0],
      ['Q-2026-015', 10, 10, 3, 1, 15, 'draft', 'Concrete patio and walkways', 550, 0.12, 149.00, 0, 0, 8.25, 12.29, 161.29, '2026-05-20', 149.00, 93.0],
      ['Q-2026-016', 16, 16, 1, 1, 15, 'accepted', 'House wash plus deck cleaning', 3600, 0.15, 540.00, 5, 27.00, 8.25, 42.32, 555.32, '2026-05-20', 550.00, 84.0],
    ];

    for (const q of quotesData) {
      await client.query(
        `INSERT INTO quotes (quote_number, customer_id, property_id, service_id, location_id, prepared_by, status, description, total_sqft, unit_price, subtotal, discount_percent, discount_amount, tax_rate, tax_amount, total_amount, valid_until, ai_suggested_price, ai_confidence_score)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
        q
      );
    }
    console.log('Quotes seeded.');

    // ========================================================
    // 9. JOBS
    // ========================================================
    const jobsData = [
      ['J-2026-001', 1, 1, 1, 1, 1, 1, 4, 'completed', 'normal', '2026-03-10', '08:00', '10:00', '2026-03-10 08:05:00', '2026-03-10 09:55:00', 120, 110, 2400, 389.70, 'Sunny', 72, null, 'Customer very satisfied'],
      ['J-2026-002', 2, 2, 2, 2, 1, 1, 4, 'completed', 'normal', '2026-03-11', '07:30', '10:00', '2026-03-11 07:35:00', '2026-03-11 10:10:00', 150, 155, 3200, 935.28, 'Overcast', 68, null, 'Heavy algae on north side required extra dwell time'],
      ['J-2026-003', null, 3, 3, 3, 1, 2, 5, 'scheduled', 'normal', '2026-03-25', '09:00', '10:30', null, null, 90, null, 450, 161.29, null, null, null, null],
      ['J-2026-004', 4, 4, 4, 4, 1, 1, 4, 'completed', 'high', '2026-03-12', '08:00', '11:00', '2026-03-12 08:10:00', '2026-03-12 11:20:00', 180, 190, 800, 433.00, 'Sunny', 75, null, 'Applied Defy Extreme stain after cleaning'],
      ['J-2026-005', 5, 5, 5, 3, 1, 2, 5, 'completed', 'normal', '2026-03-13', '10:00', '11:30', '2026-03-13 10:00:00', '2026-03-13 11:25:00', 90, 85, 500, 161.29, 'Sunny', 78, null, 'Clean job, no issues'],
      ['J-2026-006', 7, 7, 7, 5, 1, 1, 4, 'completed', 'normal', '2026-03-14', '08:00', '10:00', '2026-03-14 08:00:00', '2026-03-14 09:50:00', 120, 110, 200, 433.00, 'Partly cloudy', 70, null, 'Gutters had heavy debris'],
      ['J-2026-007', 8, 11, 11, 8, 1, 3, 6, 'completed', 'high', '2026-03-15', '19:00', '23:00', '2026-03-15 19:05:00', '2026-03-15 23:15:00', 240, 250, 25000, 1840.25, 'Clear', 65, null, 'Night work - all areas completed'],
      ['J-2026-008', 9, 12, 12, 8, 1, 3, 6, 'in_progress', 'normal', '2026-03-23', '06:00', '10:00', '2026-03-23 06:00:00', null, 240, null, 18000, 1753.65, 'Sunny', 71, null, null],
      ['J-2026-009', 12, 15, 15, 10, 2, 2, 5, 'scheduled', 'normal', '2026-03-26', '05:00', '09:00', null, null, 240, null, 20000, 1299.00, null, null, null, null],
      ['J-2026-010', 13, 8, 8, 1, 1, 1, 4, 'scheduled', 'normal', '2026-03-27', '08:00', '10:00', null, null, 120, null, 1600, 259.80, null, null, null, null],
      ['J-2026-011', 16, 16, 16, 1, 1, 1, 4, 'scheduled', 'normal', '2026-03-28', '08:00', '11:00', null, null, 180, null, 3600, 555.32, null, null, null, null],
      ['J-2026-012', null, 6, 6, 1, 1, 1, 4, 'pending', 'low', '2026-04-01', '09:00', '12:00', null, null, 180, null, 5200, 962.58, null, null, null, null],
      ['J-2026-013', null, 10, 10, 3, 1, 2, 5, 'pending', 'normal', '2026-04-02', '08:00', '09:30', null, null, 90, null, 550, 161.29, null, null, null, null],
      ['J-2026-014', null, 9, 9, 4, 1, 1, 4, 'pending', 'normal', '2026-04-03', '08:00', '11:00', null, null, 180, null, 700, 378.88, null, null, null, null],
      ['J-2026-015', null, 13, 13, 9, 1, 3, 6, 'pending', 'high', '2026-04-07', '19:00', '22:00', null, null, 180, null, 4500, 648.42, null, null, null, null],
    ];

    for (const j of jobsData) {
      await client.query(
        `INSERT INTO jobs (job_number, quote_id, customer_id, property_id, service_id, location_id, crew_id, assigned_to, status, priority, scheduled_date, scheduled_time_start, scheduled_time_end, actual_start, actual_end, estimated_duration_minutes, actual_duration_minutes, total_sqft, amount, weather_conditions, temperature_f, notes, completion_notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)`,
        j
      );
    }
    console.log('Jobs seeded.');

    // ========================================================
    // 10. EQUIPMENT
    // ========================================================
    const equipmentData = [
      ['8 GPM Hot Water Skid', 'Pressure Washer', 'Hydro Tek', 'SS Series 8040', 'HT-2024-001', 'hot_water_skid', 4000, 8.00, 'Diesel/12V', '2024-06-15', 18500.00, 15000.00, 1, 1, 'available', 8, '2026-02-15', '2026-05-15', 820.5, 'Primary commercial unit', '2026-06-15'],
      ['5.5 GPM Cold Water', 'Pressure Washer', 'Simpson', 'PS61002-S', 'SP-2024-002', 'cold_water', 4200, 5.50, 'Gas', '2024-03-10', 4200.00, 3200.00, 1, 2, 'available', 7, '2026-01-20', '2026-04-20', 650.0, 'Residential workhorse', '2027-03-10'],
      ['4 GPM Belt Drive', 'Pressure Washer', 'Pressure-Pro', 'E4040HC', 'PP-2023-003', 'cold_water', 4000, 4.00, 'Gas', '2023-09-01', 3800.00, 2800.00, 1, 1, 'available', 7, '2026-03-01', '2026-06-01', 1100.0, 'Backup residential unit', '2025-09-01'],
      ['8 GPM Soft Wash System', 'Soft Wash System', 'Southeast Softwash', 'Pro 8 GPM', 'SS-2025-004', 'soft_wash_system', 150, 8.00, '12V Electric', '2025-01-15', 6500.00, 5800.00, 1, 1, 'available', 9, '2026-03-10', '2026-06-10', 320.0, 'Primary soft wash rig', '2027-01-15'],
      ['5 GPM Soft Wash System', 'Soft Wash System', 'Bob at Pressuretek', 'Fatboy 5 GPM', 'PT-2024-005', 'soft_wash_system', 100, 5.00, '12V Electric', '2024-08-20', 4200.00, 3600.00, 3, 4, 'available', 8, '2026-02-20', '2026-05-20', 480.0, 'SA location soft wash', '2026-08-20'],
      ['20" Surface Cleaner', 'Surface Cleaner', 'Whisper Wash', 'WW-2000 Classic', 'WW-2024-006', 'surface_cleaner', 4000, null, null, '2024-04-10', 750.00, 600.00, 1, 2, 'available', 8, '2026-03-15', '2026-06-15', 580.0, 'Residential driveways', null],
      ['24" Surface Cleaner', 'Surface Cleaner', 'Whisper Wash', 'WW-2400 Big Guy', 'WW-2025-007', 'surface_cleaner', 5000, null, null, '2025-02-01', 1100.00, 1000.00, 1, 3, 'available', 9, '2026-03-01', '2026-06-01', 200.0, 'Commercial parking lots', null],
      ['100 Gallon Chem Tank', 'Chemical Tank', 'Norwesco', '100 Gal Cone Bottom', 'NW-2024-008', 'chemical_tank', null, null, null, '2024-06-15', 280.00, 200.00, 1, 1, 'available', 8, null, null, null, 'Mounted on soft wash trailer', null],
      ['200 Gallon Water Tank', 'Water Tank', 'Norwesco', '200 Gal Leg Tank', 'NW-2024-009', 'buffer_tank', null, null, null, '2024-06-15', 350.00, 280.00, 1, 1, 'available', 8, null, null, null, 'Buffer tank on rig 1', null],
      ['300 ft Pressure Hose', 'Hose', 'Simpson', '3/8" 4500 PSI', 'SH-2024-010', 'pressure_hose', 4500, null, null, '2024-07-01', 220.00, 150.00, 1, 1, 'available', 6, null, null, null, '100ft sections x3', null],
      ['Downstream Injector', 'Injector', 'General Pump', 'DEMA 862 Hi-Draw', 'GP-2024-011', 'downstream_injector', null, null, null, '2024-05-01', 45.00, 30.00, 1, 1, 'available', 7, null, null, null, null, null],
      ['X-Jet M5 Nozzle', 'Nozzle', 'Bob at Pressuretek', 'X-Jet M5', 'XJ-2025-012', 'xjet_nozzle', null, null, null, '2025-03-15', 120.00, 100.00, 1, 1, 'available', 9, null, null, null, 'For 2nd story soft wash', null],
      ['J-Rod 4-Tip Assembly', 'Nozzle', 'Southside Industrial', 'J-Rod Quad', 'JR-2024-013', 'jrod', null, null, null, '2024-06-01', 85.00, 65.00, 1, 1, 'available', 7, null, null, null, 'Soap / rinse dual lance', null],
      ['12V Transfer Pump', 'Pump', 'Everflo', 'EF5500 5.5 GPM', 'EF-2025-014', 'transfer_pump', null, 5.50, '12V Electric', '2025-01-15', 180.00, 160.00, 1, 1, 'available', 9, null, null, 200.0, 'Soft wash proportioner pump', null],
      ['Telescoping Wand 24ft', 'Wand', 'Steel Eagle', 'Fury 2400', 'SE-2024-015', 'telescoping_wand', 4000, null, null, '2024-10-01', 650.00, 550.00, 1, 1, 'available', 8, null, null, null, 'For 3rd story rinse', null],
      ['Honda GX390 Engine', 'Engine', 'Honda', 'GX390 QAE2', 'HN-2024-016', 'engine', null, null, 'Gas', '2024-03-10', 850.00, 700.00, 1, 2, 'in_use', 7, '2026-02-01', '2026-05-01', 650.0, 'Engine for Simpson unit', '2026-03-10'],
    ];

    for (const e of equipmentData) {
      await client.query(
        `INSERT INTO equipment (name, category, brand, model, serial_number, equipment_type, psi_rating, gpm_rating, fuel_type, purchase_date, purchase_price, current_value, location_id, assigned_crew_id, status, condition_rating, last_service_date, next_service_date, hours_used, notes, warranty_expiry)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
        e
      );
    }
    console.log('Equipment seeded.');

    // ========================================================
    // 11. CHEMICALS
    // ========================================================
    const chemicalsData = [
      ['Sodium Hypochlorite 12.5%', 'Univar Solutions', 'Oxidizer', 'Sodium Hypochlorite', 12.50, null, 'gallons', 275, 50, 2.85, 'Univar Solutions Austin', 'UNV-SH125', '1:3', '1:1', '10:1 downstream', '3:1 xjet', 'Vinyl siding, hardie board, stucco, brick, roofs', 'Corrosive - wear gloves and eye protection. Do not mix with acids.', 'Cool dark area, away from direct sunlight', 3, 1],
      ['Sodium Hypochlorite 10%', 'Pool Supply Warehouse', 'Oxidizer', 'Sodium Hypochlorite', 10.00, null, 'gallons', 150, 30, 2.25, 'Pool Supply Warehouse', 'PSW-SH10', '1:2', '1:1', '8:1 downstream', '2:1 xjet', 'General purpose soft wash', 'Corrosive - standard PPE required', 'Cool dark area', 2, 1],
      ['Elemonator Surfactant', 'Southeast Softwash', 'Surfactant', 'Proprietary blend', null, null, 'gallons', 15, 5, 42.00, 'Southeast Softwash', 'SSWL-ELEM', null, null, '1 oz per gallon of mix', '1 oz per gallon', 'All exterior surfaces', 'Lemon scented. Pleasant odor masks bleach.', 'Room temperature', 24, 1],
      ['Bio Wash Surfactant', 'Pressure Washing Resource', 'Surfactant', 'Proprietary blend', null, null, 'gallons', 10, 3, 38.00, 'PWR Online', 'PWR-BWSURF', null, null, '1 oz per gallon', '1 oz per gallon', 'All surfaces - adds cling', 'Apple scented surfactant', 'Room temperature', 24, 1],
      ['F13 Gutter Grenade', 'Front 9 Restoration', 'Degreaser', 'Sodium Hydroxide blend', null, null, 'gallons', 8, 3, 55.00, 'Front 9 Restoration', 'F9-GUTTER', '1:1 to full strength', null, null, null, 'Aluminum gutters, oxidation, tiger stripes', 'Caustic - full PPE required. Test on small area first.', 'Room temperature', 18, 1],
      ['F9 BARC (Barrier & Calcium)', 'Front 9 Restoration', 'Acid Cleaner', 'Hydrochloric acid blend', null, null, 'gallons', 6, 2, 62.00, 'Front 9 Restoration', 'F9-BARC', '1:1 to full strength', null, null, null, 'Rust, calcium, efflorescence, hard water stains', 'Acid - NEVER mix with bleach. Full PPE required.', 'Room temperature, sealed', 24, 1],
      ['One Restore', 'EACo Chem', 'Acid Cleaner', 'Ammoniated bifluoride', null, null, 'gallons', 5, 2, 48.00, 'EACo Chem', 'EACO-ONRST', '1:5 to 1:1', null, null, null, 'Brick, concrete, rust, efflorescence', 'Toxic fumes - use respirator. NEVER mix with bleach.', 'Cool area, sealed', 36, 1],
      ['Oxalic Acid Powder', 'Southern Stain Solutions', 'Wood Brightener', 'Oxalic Acid', 99.00, null, 'pounds', 25, 10, 6.50, 'Amazon / Southern Stain', 'SSS-OXALIC', '6 oz per gallon water', null, null, null, 'Wood decks, fences - brightener/neutralizer after bleach', 'Irritant - wear gloves. Mix in ventilated area.', 'Dry cool area', 60, 1],
      ['Sodium Percarbonate', 'Pressure Washing Resource', 'Oxygen Bleach', 'Sodium Percarbonate', 99.00, null, 'pounds', 30, 10, 5.00, 'PWR Online', 'PWR-SOPERC', '6-8 oz per gallon hot water', null, null, null, 'Wood cleaning, organic stain removal', 'Safer than chlorine for wood. Wear gloves.', 'Dry sealed container', 36, 1],
      ['Hot Water Degreaser', 'Hydro-Chem Systems', 'Degreaser', 'Alkaline degreaser', null, null, 'gallons', 20, 5, 28.00, 'Hydro-Chem Systems', 'HCS-HWDEG', '1:10 to 1:5', null, '8:1 downstream', null, 'Dumpster pads, kitchen hoods, grease stains', 'Alkaline - wear gloves. Designed for hot water use.', 'Room temperature', 24, 1],
      ['Sodium Hydroxide 50%', 'Univar Solutions', 'Alkaline Cleaner', 'Sodium Hydroxide', 50.00, null, 'gallons', 15, 5, 8.50, 'Univar Solutions Austin', 'UNV-NaOH50', '1:20 to 1:5', null, null, null, 'Heavy grease, oil stains, gutter oxidation', 'Extremely caustic - full PPE required. Flush with water immediately if contact.', 'Sealed container, cool area', 24, 1],
      ['Citric Acid Powder', 'Bulk Supplements', 'Acid Cleaner', 'Citric Acid', 100.00, null, 'pounds', 20, 5, 4.50, 'Amazon Bulk', 'BULK-CITRIC', '4 oz per gallon water', null, null, null, 'Post-wash neutralizer, light rust, hard water', 'Food grade. Mild skin irritant - wear gloves.', 'Dry sealed container', 60, 1],
      ['Arm-A-Cide Disinfectant', 'Armchem International', 'Disinfectant', 'Quaternary ammonium', null, null, 'gallons', 5, 2, 35.00, 'Armchem International', 'ARM-DSINF', '2 oz per gallon', null, '16:1 downstream', null, 'Dumpsters, trash areas, mold remediation', 'EPA registered disinfectant. Wear standard PPE.', 'Room temperature', 36, 1],
      ['EBC Enviro Bio Cleaner', 'EBC Industries', 'Biocide', 'Proprietary enzyme blend', null, null, 'gallons', 8, 3, 45.00, 'EBC Industries', 'EBC-ENVBIO', '4 oz per gallon', null, null, null, 'Organic growth prevention post-wash', 'Eco-friendly. Safe around plants when diluted.', 'Room temperature', 18, 1],
      ['Purple Power Degreaser', 'Aiken Chemical', 'Degreaser', 'Alkaline degreaser', null, null, 'gallons', 12, 5, 12.00, 'Home Depot / Lowes', 'PP-PURPWR', '1:3 to full strength', null, '6:1 downstream', null, 'Oil stains, tire marks, automotive grease', 'Alkaline - gloves required. Rinse surfaces well.', 'Room temperature', 36, 1],
      ['Rust-Off Stain Remover', 'Southern Stain Solutions', 'Specialty', 'Hydrofluoric acid blend', null, null, 'quarts', 6, 2, 22.00, 'Southern Stain', 'SSS-RSTOFF', 'Full strength or 1:1', null, null, null, 'Fertilizer stains, irrigation rust, battery acid', 'HIGHLY TOXIC - full PPE with respirator. Use only outdoors.', 'Locked cabinet, sealed', 24, 1],
    ];

    for (const ch of chemicalsData) {
      await client.query(
        `INSERT INTO chemicals (name, brand, chemical_type, active_ingredient, concentration_percent, sds_url, unit_of_measure, current_stock, reorder_level, cost_per_unit, supplier, supplier_sku, mixing_ratio_chemical, mixing_ratio_water, downstream_ratio, xjet_ratio, recommended_surfaces, safety_notes, storage_requirements, shelf_life_months, location_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
        ch
      );
    }
    console.log('Chemicals seeded.');

    // ========================================================
    // 12. PHOTOS
    // ========================================================
    const photosData = [
      [1, 1, 4, 'before', '/photos/J-2026-001/before_front.jpg', null, 'Front of house before wash', 'Siding', 'house-wash,before,front'],
      [1, 1, 4, 'before', '/photos/J-2026-001/before_rear.jpg', null, 'Rear of house showing algae', 'Siding', 'house-wash,before,rear,algae'],
      [1, 1, 4, 'after', '/photos/J-2026-001/after_front.jpg', null, 'Front of house after wash - spotless', 'Siding', 'house-wash,after,front'],
      [1, 1, 4, 'after', '/photos/J-2026-001/after_rear.jpg', null, 'Rear of house after wash', 'Siding', 'house-wash,after,rear'],
      [2, 2, 4, 'before', '/photos/J-2026-002/before_roof_north.jpg', null, 'North side roof heavy algae streaks', 'Roof', 'roof-wash,before,algae,black-streaks'],
      [2, 2, 4, 'before', '/photos/J-2026-002/before_roof_south.jpg', null, 'South side roof moderate staining', 'Roof', 'roof-wash,before'],
      [2, 2, 4, 'during', '/photos/J-2026-002/during_application.jpg', null, 'Chemical application in progress', 'Roof', 'roof-wash,during,chemical-application'],
      [2, 2, 4, 'after', '/photos/J-2026-002/after_roof_north.jpg', null, 'North side roof clean', 'Roof', 'roof-wash,after'],
      [4, 4, 4, 'before', '/photos/J-2026-004/before_deck.jpg', null, 'Deck before restoration - gray and dirty', 'Deck', 'deck,before,wood'],
      [4, 4, 4, 'after', '/photos/J-2026-004/after_deck.jpg', null, 'Deck after cleaning and brightening', 'Deck', 'deck,after,brightened'],
      [5, 5, 5, 'before', '/photos/J-2026-005/before_driveway.jpg', null, 'Driveway with tire marks and oil stains', 'Concrete', 'concrete,before,driveway'],
      [5, 5, 5, 'after', '/photos/J-2026-005/after_driveway.jpg', null, 'Driveway after surface cleaning', 'Concrete', 'concrete,after,driveway'],
      [6, 7, 4, 'before', '/photos/J-2026-006/before_gutters.jpg', null, 'Gutters with tiger stripes and oxidation', 'Gutter', 'gutter,before,tiger-stripes'],
      [6, 7, 4, 'after', '/photos/J-2026-006/after_gutters.jpg', null, 'Gutters restored to white', 'Gutter', 'gutter,after,brightened'],
      [7, 11, 6, 'before', '/photos/J-2026-007/before_building.jpg', null, 'Commercial building exterior before wash', 'Building exterior', 'commercial,before,building'],
      [7, 11, 6, 'after', '/photos/J-2026-007/after_building.jpg', null, 'Commercial building sparkling clean', 'Building exterior', 'commercial,after,building'],
    ];

    for (const ph of photosData) {
      await client.query(
        `INSERT INTO photos (job_id, property_id, uploaded_by, photo_type, url, thumbnail_url, caption, surface_type, tags)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        ph
      );
    }
    console.log('Photos seeded.');

    // ========================================================
    // 13. SERVICE PLANS
    // ========================================================
    const servicePlansData = [
      ['Annual House Wash - Peterson', 1, 1, 1, 'annual', 350.00, 350.00, 10, '2026-01-01', '2026-12-31', '2026-06-15', 'active', true],
      ['Bi-Annual House & Roof - Sullivan', 2, 2, 1, 'semi_annual', 650.00, 1300.00, 15, '2026-01-01', '2026-12-31', '2026-07-01', 'active', true],
      ['Quarterly Concrete - Chen', 3, 3, 3, 'quarterly', 130.00, 520.00, 12, '2026-01-01', '2026-12-31', '2026-04-01', 'active', true],
      ['Annual Deck Maintenance - Williams', 4, 4, 4, 'annual', 380.00, 380.00, 5, '2026-03-01', '2027-02-28', '2027-03-01', 'active', true],
      ['Monthly Storefront - Texas Retail', 12, 12, 8, 'monthly', 450.00, 5400.00, 20, '2026-01-01', '2026-12-31', '2026-04-01', 'active', true],
      ['Quarterly Building Wash - Hill Country PM', 11, 11, 15, 'quarterly', 1700.00, 6800.00, 15, '2026-01-01', '2026-12-31', '2026-04-01', 'active', true],
      ['Monthly Parking Lot - Auto Group', 15, 15, 10, 'monthly', 1100.00, 13200.00, 8, '2026-01-01', '2026-12-31', '2026-04-01', 'active', true],
      ['Bi-Annual House Wash - Thompson', 6, 6, 1, 'semi_annual', 850.00, 1700.00, 10, '2026-01-01', '2026-12-31', '2026-05-01', 'active', true],
      ['Annual House Wash - Davis', 7, 7, 1, 'annual', 420.00, 420.00, 5, '2026-02-01', '2027-01-31', '2026-08-01', 'active', true],
      ['Annual House & Concrete - Garcia', 8, 8, 1, 'annual', 350.00, 350.00, 10, '2026-01-01', '2026-12-31', '2026-09-01', 'active', true],
      ['Quarterly Restaurant Wash - Lone Star', 13, 13, 9, 'quarterly', 550.00, 2200.00, 10, '2026-01-01', '2026-12-31', '2026-04-07', 'active', true],
      ['Monthly Apartment Complex - Sunset', 14, 14, 15, 'monthly', 2800.00, 33600.00, 22, '2026-01-01', '2026-12-31', '2026-04-01', 'active', false],
      ['Annual Full Service - Wilson', 10, 10, 1, 'annual', 280.00, 280.00, 5, '2026-03-01', '2027-02-28', '2026-09-01', 'active', true],
      ['Bi-Annual Deck & House - Patel', 16, 16, 1, 'semi_annual', 500.00, 1000.00, 10, '2026-01-01', '2026-12-31', '2026-06-01', 'active', true],
      ['Annual House Wash - Brown', 9, 9, 1, 'annual', 320.00, 320.00, 5, '2026-04-01', '2027-03-31', '2026-04-15', 'active', true],
    ];

    for (const sp of servicePlansData) {
      await client.query(
        `INSERT INTO service_plans (plan_name, customer_id, property_id, service_id, frequency, price_per_visit, annual_price, discount_percent, start_date, end_date, next_service_date, status, auto_renew)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        sp
      );
    }
    console.log('Service plans seeded.');

    // ========================================================
    // 14. INVOICES
    // ========================================================
    const invoicesData = [
      ['INV-2026-001', 1, 1, 1, 1, 'paid', '2026-03-10', '2026-03-25', 360.00, 0, 8.25, 29.70, 389.70, 389.70, 'credit_card', '2026-03-12', null],
      ['INV-2026-002', 2, 2, 2, 1, 'paid', '2026-03-11', '2026-03-26', 960.00, 96.00, 8.25, 71.28, 935.28, 935.28, 'check', '2026-03-20', null],
      ['INV-2026-003', 4, 4, 4, 1, 'paid', '2026-03-12', '2026-03-27', 400.00, 0, 8.25, 33.00, 433.00, 433.00, 'credit_card', '2026-03-13', null],
      ['INV-2026-004', 5, 5, 5, 1, 'paid', '2026-03-13', '2026-03-28', 149.00, 0, 8.25, 12.29, 161.29, 161.29, 'cash', '2026-03-13', null],
      ['INV-2026-005', 7, 6, 7, 1, 'paid', '2026-03-14', '2026-03-29', 400.00, 0, 8.25, 33.00, 433.00, 433.00, 'credit_card', '2026-03-15', null],
      ['INV-2026-006', 11, 7, 8, 1, 'sent', '2026-03-15', '2026-04-14', 2000.00, 300.00, 8.25, 140.25, 1840.25, 0, null, null, null],
      ['INV-2026-007', 12, 8, 9, 1, 'sent', '2026-03-23', '2026-04-22', 1800.00, 180.00, 8.25, 133.65, 1753.65, 0, null, null, null],
      ['INV-2026-008', 8, null, 13, 1, 'draft', '2026-03-27', '2026-04-11', 240.00, 0, 8.25, 19.80, 259.80, 0, null, null, null],
      ['INV-2026-009', 16, null, 16, 1, 'draft', '2026-03-28', '2026-04-12', 540.00, 27.00, 8.25, 42.32, 555.32, 0, null, null, null],
      ['INV-2026-010', 3, null, null, 1, 'draft', '2026-03-25', '2026-04-09', 149.00, 0, 8.25, 12.29, 161.29, 0, null, null, null],
      ['INV-2026-011', 6, null, null, 1, 'draft', '2026-04-01', '2026-04-16', 936.00, 46.80, 8.25, 73.38, 962.58, 0, null, null, null],
      ['INV-2026-012', 15, 9, 12, 2, 'sent', '2026-03-26', '2026-04-25', 1200.00, 0, 8.25, 99.00, 1299.00, 0, null, null, null],
      ['INV-2026-013', 10, null, null, 1, 'draft', '2026-04-02', '2026-04-17', 149.00, 0, 8.25, 12.29, 161.29, 0, null, null, null],
      ['INV-2026-014', 9, null, null, 1, 'draft', '2026-04-03', '2026-04-18', 350.00, 0, 8.25, 28.88, 378.88, 0, null, null, null],
      ['INV-2026-015', 13, null, null, 1, 'draft', '2026-04-07', '2026-04-22', 599.00, 0, 8.25, 49.42, 648.42, 0, null, null, null],
    ];

    for (const inv of invoicesData) {
      await client.query(
        `INSERT INTO invoices (invoice_number, customer_id, job_id, quote_id, location_id, status, issue_date, due_date, subtotal, discount_amount, tax_rate, tax_amount, total_amount, amount_paid, payment_method, payment_date, stripe_payment_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        inv
      );
    }
    console.log('Invoices seeded.');

    // ========================================================
    // 15. INVOICE ITEMS
    // ========================================================
    const invoiceItemsData = [
      [1, 1, 'House Wash - 2400 sqft hardie board exterior', 2400, 0.15, 360.00, 1],
      [2, 2, 'Roof Soft Wash - 3200 sqft metal standing seam', 3200, 0.30, 960.00, 1],
      [3, 4, 'Deck Restoration - 800 sqft Trex composite', 800, 0.50, 400.00, 1],
      [4, 3, 'Concrete Cleaning - 500 sqft driveway and patio', 500, 0.12, 149.00, 1],
      [5, 5, 'Gutter Cleaning & Brightening - 200 linear feet', 200, 2.00, 400.00, 1],
      [6, 15, 'Commercial Building Wash - 25000 sqft exterior', 25000, 0.08, 2000.00, 1],
      [7, 8, 'Commercial Storefront Wash - 18000 sqft', 18000, 0.10, 1800.00, 1],
      [8, 1, 'House Wash - 1600 sqft vinyl siding', 1600, 0.15, 240.00, 1],
      [9, 1, 'House Wash - 3600 sqft limestone exterior', 3600, 0.15, 540.00, 1],
      [10, 3, 'Concrete Cleaning - driveway and sidewalks', 450, 0.12, 149.00, 1],
      [11, 1, 'House Wash - 5200 sqft stone veneer estate', 5200, 0.18, 936.00, 1],
      [12, 10, 'Parking Lot Cleaning - 20000 sqft', 20000, 0.06, 1200.00, 1],
      [13, 3, 'Concrete Patio and Walkways - 550 sqft', 550, 0.12, 149.00, 1],
      [14, 4, 'Deck and Fence Staining - 700 sqft', 700, 0.50, 350.00, 1],
      [15, 9, 'Restaurant Exterior Hot Water Wash', 1, 599.00, 599.00, 1],
    ];

    for (const ii of invoiceItemsData) {
      await client.query(
        `INSERT INTO invoice_items (invoice_id, service_id, description, quantity, unit_price, total_price, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        ii
      );
    }
    console.log('Invoice items seeded.');

    // ========================================================
    // 16. CONTRACTS
    // ========================================================
    const contractsData = [
      ['CON-2026-001', 11, 11, 1, 'Hill Country Plaza Quarterly Exterior Maintenance', 'Full building exterior wash, sidewalk cleaning, and entrance pressure washing', 'annual', 'active', '2026-01-01', '2026-12-31', 1700.00, 6800.00, 'Net 30', 'Quarterly exterior building wash of all 3 floors, sidewalk cleaning, entrance glass rinse. Night work required (7pm-6am).', 'quarterly', false, '2025-12-15', 'Thomas Nakamura', null],
      ['CON-2026-002', 12, 12, 1, 'Lamar Retail Center Monthly Storefront', 'Monthly storefront and sidewalk cleaning for retail center', 'annual', 'active', '2026-01-01', '2026-12-31', 450.00, 5400.00, 'Net 15', 'Monthly cleaning of all storefront facades and 20ft perimeter sidewalks. Before business hours only.', 'monthly', true, '2025-12-20', 'Angela Reeves', null],
      ['CON-2026-003', 13, 13, 1, 'Lone Star Restaurant Group Quarterly Deep Clean', 'Kitchen exhaust, dumpster pad, and building exterior', 'annual', 'active', '2026-01-01', '2026-12-31', 550.00, 2200.00, 'Net 30', 'Quarterly hot water wash: dumpster pad degreasing, kitchen exhaust hood exterior, building facade, sidewalk. Monday schedule only.', 'quarterly', true, '2025-12-18', 'Richard Okonkwo', null],
      ['CON-2026-004', 14, 14, 1, 'Sunset Apartments Full Complex Maintenance', '120-unit apartment complex monthly exterior maintenance', 'annual', 'active', '2026-01-01', '2026-12-31', 2800.00, 33600.00, 'Net 30', 'Monthly: building exteriors (rotate 2 buildings/month), all sidewalks, pool deck, parking areas. Quarterly: full complex wash.', 'monthly', false, '2025-12-22', 'Sandra Lopez', null],
      ['CON-2026-005', 15, 15, 2, 'Auto Dealership Campus Monthly Wash', 'Parking lot, showroom exterior, and service area cleaning', 'annual', 'active', '2026-01-01', '2026-12-31', 1100.00, 13200.00, 'Net 30', 'Monthly parking lot surface clean (20000 sqft), showroom glass rinse, service bay exterior. Early morning (5am-9am).', 'monthly', true, '2025-12-28', 'Charles Kim', null],
      ['CON-2026-006', 11, 11, 1, 'Hill Country - Additional Window Washing', 'Quarterly window cleaning for office building', 'annual', 'draft', '2026-04-01', '2027-03-31', 800.00, 3200.00, 'Net 30', 'Quarterly exterior window cleaning for all 3 floors using water-fed pole system.', 'quarterly', false, null, null, null],
      ['CON-2026-007', 12, 12, 1, 'Lamar Retail - Parking Lot Add-On', 'Quarterly parking lot deep clean', 'annual', 'pending', '2026-04-01', '2027-03-31', 600.00, 2400.00, 'Net 15', 'Quarterly deep cleaning of parking lot including oil stain treatment and gum removal.', 'quarterly', true, null, null, null],
      ['CON-2026-008', 14, 14, 1, 'Sunset Apartments - Pool Season Extra', 'Weekly pool deck maintenance April-September', 'seasonal', 'draft', '2026-04-01', '2026-09-30', 400.00, 2400.00, 'Net 30', 'Weekly pool deck pressure wash during swim season. 6-month seasonal contract.', 'weekly', false, null, null, null],
      ['CON-2026-009', 15, 15, 2, 'Auto Dealership - Fleet Wash Bundle', 'Weekly fleet vehicle washing for dealership inventory', 'annual', 'active', '2026-01-01', '2026-12-31', 600.00, 7200.00, 'Net 30', 'Weekly washing of up to 20 vehicles on lot. Includes new arrivals and service vehicles.', 'weekly', true, '2025-12-28', 'Charles Kim', null],
      ['CON-2026-010', 11, 11, 1, 'Hill Country - Emergency Graffiti Response', 'On-call graffiti removal service', 'annual', 'active', '2026-01-01', '2026-12-31', null, 2400.00, 'Net 15', 'On-call graffiti removal. Response within 24 hours. Flat annual retainer with per-incident billing over 6 calls/year.', 'on_call', false, '2025-12-15', 'Thomas Nakamura', null],
      ['CON-2026-011', 13, 13, 1, 'Lone Star - New Location Opening', 'Pre-opening deep clean for new restaurant', 'one_time', 'pending', '2026-05-01', '2026-05-31', null, 1500.00, 'Due on completion', 'Full pre-opening clean: building exterior, patio, sidewalks, dumpster area, drive-through.', 'one_time', false, null, null, null],
      ['CON-2026-012', 14, 14, 1, 'Sunset Apartments - Roof Wash', 'Annual roof soft wash for all 8 buildings', 'annual', 'draft', '2026-06-01', '2027-05-31', null, 8500.00, 'Net 30', 'Annual soft wash of all 8 building roofs. Shingle and flat membrane mix. Schedule 2 buildings per quarter.', 'annual', false, null, null, null],
      ['CON-2026-013', 15, 15, 2, 'Auto Group - Service Center Deep Clean', 'Quarterly service center degreasing', 'annual', 'active', '2026-01-01', '2026-12-31', 450.00, 1800.00, 'Net 30', 'Quarterly hot water degreasing of service bays, lift areas, and parts wash area.', 'quarterly', true, '2025-12-28', 'Charles Kim', null],
      ['CON-2026-014', 12, 12, 1, 'Lamar Retail - Seasonal Holiday Clean', 'Pre-holiday season deep clean', 'seasonal', 'draft', '2026-11-01', '2026-11-30', null, 2200.00, 'Due on completion', 'Pre-holiday deep clean: all storefronts, sidewalks, parking lot, seasonal decoration prep.', 'one_time', false, null, null, null],
      ['CON-2026-015', 11, 11, 1, 'Hill Country Plaza - 2027 Renewal', 'Full maintenance contract renewal for 2027', 'annual', 'draft', '2027-01-01', '2027-12-31', 1800.00, 7200.00, 'Net 30', 'Renewal: quarterly building wash, window cleaning, sidewalks. 6% price increase over 2026.', 'quarterly', false, null, null, null],
    ];

    for (const c of contractsData) {
      await client.query(
        `INSERT INTO contracts (contract_number, customer_id, property_id, location_id, title, description, contract_type, status, start_date, end_date, monthly_amount, annual_amount, payment_terms, scope_of_work, frequency, auto_renew, signed_date, signed_by, document_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
        c
      );
    }
    console.log('Contracts seeded.');

    // ========================================================
    // 17. FLEET VEHICLES
    // ========================================================
    const fleetData = [
      ['truck', 'Ford', 'F-350 Super Duty', 2023, '1FT8W3BT8PED12345', 'TX-PW001', 'White', 28500, 'Diesel', 1, 1, 'active', 'STATE-FARM-001', '2026-12-01', '2027-03-15', '2026-01-15', '2027-01-15', 'GT-001', 'Primary rig truck with custom flatbed'],
      ['truck', 'Ford', 'F-250 XLT', 2022, '1FT7W2BT3NED23456', 'TX-PW002', 'White', 42100, 'Gas', 2, 1, 'active', 'STATE-FARM-001', '2026-12-01', '2027-03-15', '2025-11-10', '2026-11-10', 'GT-002', 'Residential crew truck'],
      ['truck', 'Ram', '3500 Tradesman', 2024, '3C63RRHL5RG345678', 'TX-PW003', 'Silver', 15200, 'Diesel', 3, 1, 'active', 'STATE-FARM-001', '2026-12-01', '2027-06-20', '2026-01-20', '2027-01-20', 'GT-003', 'Commercial crew truck'],
      ['truck', 'Chevrolet', 'Silverado 2500HD', 2021, '1GC4YLEY7MF456789', 'TX-PW004', 'Black', 55800, 'Gas', 4, 3, 'active', 'STATE-FARM-002', '2026-12-01', '2027-02-28', '2025-09-01', '2026-09-01', 'GT-004', 'SA location truck'],
      ['truck', 'Ford', 'F-350 Lariat', 2024, '1FT8W3BT0RED56789', 'TX-PW005', 'Blue', 8900, 'Diesel', 5, 4, 'active', 'STATE-FARM-001', '2026-12-01', '2027-08-01', '2026-02-01', '2027-02-01', 'GT-005', 'Round Rock crew truck'],
      ['trailer', 'Big Tex', '70PI-16', 2023, '16VCX1625P1234567', 'TX-TR001', 'Black', null, null, 1, 1, 'active', 'STATE-FARM-001', '2026-12-01', '2027-03-15', null, null, null, '6x16 enclosed - soft wash rig #1'],
      ['trailer', 'Carry-On', '6x12 Enclosed', 2022, '4YMCL1218NT234567', 'TX-TR002', 'White', null, null, 2, 1, 'active', 'STATE-FARM-001', '2026-12-01', '2027-03-15', null, null, null, '6x12 enclosed - residential rig'],
      ['trailer', 'PJ Trailers', 'C5-1032', 2024, '4P51C1020R1345678', 'TX-TR003', 'Black', null, null, 3, 1, 'active', 'STATE-FARM-001', '2026-12-01', '2027-03-15', null, null, null, '5x10 open - surface cleaner rig'],
      ['trailer', 'Big Tex', '70PI-20', 2023, '16VCX2025P2345678', 'TX-TR004', 'White', null, null, null, 3, 'active', 'STATE-FARM-002', '2026-12-01', '2027-02-28', null, null, null, '8x20 enclosed - hot water rig SA'],
      ['trailer', 'Carry-On', '7x14 Enclosed', 2024, '4YMCL1424R3456789', 'TX-TR005', 'Black', null, null, null, 4, 'active', 'STATE-FARM-001', '2026-12-01', '2027-03-15', null, null, null, '7x14 enclosed - Round Rock rig'],
      ['van', 'Ford', 'Transit 250', 2023, '1FTBR1C85PKA12345', 'TX-PW006', 'White', 31200, 'Gas', null, 1, 'active', 'STATE-FARM-001', '2026-12-01', '2027-04-01', '2026-01-10', '2027-01-10', 'GT-006', 'Window cleaning van'],
      ['truck', 'Toyota', 'Tacoma SR5', 2022, '3TYCZ5AN0NT567890', 'TX-PW007', 'Gray', 38700, 'Gas', null, 1, 'active', 'STATE-FARM-001', '2026-12-01', '2027-03-15', '2025-10-15', '2026-10-15', null, 'Sales/estimating truck'],
      ['truck', 'Ford', 'F-150 XL', 2021, '1FTEW1EP5MFA67890', 'TX-PW008', 'White', 62300, 'Gas', null, 2, 'active', 'STATE-FARM-001', '2026-12-01', '2027-01-31', '2025-08-01', '2026-08-01', null, 'North Austin utility truck'],
      ['truck', 'Ram', '2500 Laramie', 2024, '3C6UR5NL1RG456789', 'TX-PW009', 'White', 6200, 'Diesel', null, 1, 'active', 'STATE-FARM-001', '2026-12-01', '2027-09-01', '2026-03-01', '2027-03-01', 'GT-009', 'Spare / overflow truck'],
      ['trailer', 'Load Trail', 'CS07x16', 2025, '5LDCS1627S1567890', 'TX-TR006', 'Black', null, null, null, 1, 'active', 'STATE-FARM-001', '2026-12-01', '2027-03-15', null, null, null, '7x16 new build - soft wash rig #2'],
    ];

    for (const f of fleetData) {
      await client.query(
        `INSERT INTO fleet_vehicles (vehicle_type, make, model, year, vin, license_plate, color, mileage, fuel_type, assigned_crew_id, location_id, status, insurance_policy, insurance_expiry, registration_expiry, last_inspection, next_inspection, gps_tracker_id, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
        f
      );
    }
    console.log('Fleet vehicles seeded.');

    // ========================================================
    // 18. MAINTENANCE LOGS
    // ========================================================
    const maintenanceData = [
      [1, null, 4, 'Oil Change', 'Changed oil and filter on Hydro Tek hot water skid engine', 'Oil filter, 15W-40 oil', 85.00, 'In-house', 800.0, null, '2026-05-15', 1000.0, 'completed', '2026-02-15'],
      [2, null, 5, 'Pump Rebuild', 'Rebuilt unloader valve and replaced seals on Simpson pump', 'Unloader valve kit, pump seals', 220.00, 'Pump Repair Shop Austin', 630.0, null, null, null, 'completed', '2026-01-20'],
      [3, null, 4, 'General Service', 'Cleaned pump inlet filter, checked oil, tightened fittings', null, 0, 'In-house', 1080.0, null, '2026-06-01', 1200.0, 'completed', '2026-03-01'],
      [4, null, 4, 'Burner Service', 'Cleaned burner nozzle, replaced fuel filter on hot water unit', 'Fuel filter, burner nozzle', 145.00, 'Hydro Tek dealer', 800.0, null, '2026-08-15', null, 'completed', '2026-02-15'],
      [6, null, 5, 'Bearing Replacement', 'Replaced swivel bearings on 20" Whisper Wash surface cleaner', 'Swivel bearings x2', 65.00, 'In-house', 560.0, null, null, null, 'completed', '2026-03-15'],
      [null, 1, 4, 'Oil Change & Tire Rotation', 'Ford F-350 regular maintenance at 28000 miles', 'Oil filter, Rotella T6 oil', 120.00, 'Jiffy Lube', null, 28000, null, null, 'completed', '2026-02-20'],
      [null, 2, 7, 'Brake Inspection', 'F-250 brake pad inspection - 50% life remaining', null, 45.00, 'Discount Tire', null, 42000, null, null, 'completed', '2026-03-05'],
      [null, 3, 9, 'Transmission Service', 'Ram 3500 transmission fluid and filter change', 'ATF fluid, trans filter', 350.00, 'Ram dealership', null, 15000, null, null, 'completed', '2026-01-15'],
      [null, 4, 10, 'Tire Replacement', 'Replaced 4 tires on Silverado 2500HD', 'BF Goodrich KO2 x4', 1100.00, 'Discount Tire', null, 55000, null, null, 'completed', '2025-12-10'],
      [14, null, 4, 'Pump Replacement', 'Replaced Everflo transfer pump - motor burned out', 'Everflo EF5500 pump', 180.00, 'Pressuretek.com', 200.0, null, null, null, 'completed', '2026-03-10'],
      [null, 6, 4, 'Trailer Bearing Repack', 'Repacked wheel bearings on Big Tex 70PI-16 trailer', 'Bearing grease, seals x2', 95.00, 'In-house', null, null, null, null, 'completed', '2026-01-25'],
      [16, null, 5, 'Engine Oil Change', 'Honda GX390 oil change at 650 hours', 'Honda 10W-30, drain plug gasket', 25.00, 'In-house', 650.0, null, '2026-05-01', 750.0, 'completed', '2026-02-01'],
      [null, 11, 8, 'Brake Service', 'Transit 250 front brake pads and rotors', 'Brake pads, rotors', 380.00, 'Ford dealership', null, 31000, null, null, 'completed', '2026-02-28'],
      [15, null, 4, 'Wand O-Ring Replacement', 'Replaced O-rings on Steel Eagle telescoping wand connections', 'O-ring kit', 12.00, 'In-house', null, null, null, null, 'completed', '2026-03-08'],
      [null, 14, 6, 'New Tires', 'Ram 2500 new all-terrain tires', 'Toyo Open Country AT3 x4', 1250.00, 'Discount Tire', null, 6000, null, null, 'completed', '2026-03-15'],
    ];

    for (const m of maintenanceData) {
      await client.query(
        `INSERT INTO maintenance_logs (equipment_id, vehicle_id, performed_by, maintenance_type, description, parts_replaced, cost, vendor, hours_at_service, mileage_at_service, next_service_date, next_service_hours, status, performed_date)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        m
      );
    }
    console.log('Maintenance logs seeded.');

    // ========================================================
    // 19. SAFETY CHECKLISTS
    // ========================================================
    const safetyData = [
      [1, 1, 4, '2026-03-10', true, true, true, true, false, true, true, true, true, true, true, true, false, true, true, 'All good. No hearing protection needed - residential area.', 'completed'],
      [2, 1, 4, '2026-03-11', true, true, true, true, false, true, true, true, true, true, true, true, false, true, true, 'Roof work - extra caution on ladder placement.', 'completed'],
      [4, 1, 4, '2026-03-12', true, true, true, true, false, true, true, true, true, true, true, false, false, true, true, 'Deck work. No plants near deck area.', 'completed'],
      [5, 2, 5, '2026-03-13', true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, 'Surface cleaner work - hearing protection required.', 'completed'],
      [6, 1, 4, '2026-03-14', true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, 'Gutter work - ladder safety verified.', 'completed'],
      [7, 3, 6, '2026-03-15', true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, 'Night work. Hard hats mandatory. Area coned off.', 'completed'],
      [8, 3, 6, '2026-03-23', true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, 'Morning commercial job. Early start.', 'completed'],
      [null, 1, 4, '2026-03-09', true, true, true, true, false, true, true, true, true, true, false, false, false, true, true, 'Training day safety brief - no active job.', 'completed'],
      [null, 2, 5, '2026-03-09', true, true, true, true, true, true, true, true, true, true, false, false, false, true, true, 'Training day safety brief.', 'completed'],
      [null, 3, 6, '2026-03-09', true, true, true, true, true, true, true, true, true, true, false, false, false, true, true, 'Training day safety brief.', 'completed'],
      [3, 2, 5, '2026-03-25', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, null, 'pending'],
      [9, 2, 5, '2026-03-26', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, null, 'pending'],
      [10, 1, 4, '2026-03-27', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, null, 'pending'],
      [11, 1, 4, '2026-03-28', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, null, 'pending'],
      [15, 3, 6, '2026-04-07', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, null, 'pending'],
    ];

    for (const s of safetyData) {
      await client.query(
        `INSERT INTO safety_checklists (job_id, crew_id, completed_by, checklist_date, ppe_hard_hat, ppe_safety_glasses, ppe_gloves, ppe_boots, ppe_hearing_protection, equipment_inspected, hoses_inspected, chemical_labels_checked, sds_sheets_available, area_secured, windows_closed, plants_covered, vehicles_moved, electrical_hazards_checked, weather_appropriate, notes, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
        s
      );
    }
    console.log('Safety checklists seeded.');

    // ========================================================
    // 20. INSURANCE CERTIFICATES
    // ========================================================
    const insuranceData = [
      ['General Liability', 'State Farm', 'GL-2026-TX-001', 2000000.00, 5000.00, 425.00, 5100.00, '2026-01-01', '2027-01-01', 'active', 'Bob Richardson', '(555) 500-0001', 'bob.r@statefarm.com', null, 1],
      ['Commercial Auto', 'State Farm', 'CA-2026-TX-002', 1000000.00, 2500.00, 380.00, 4560.00, '2026-01-01', '2027-01-01', 'active', 'Bob Richardson', '(555) 500-0001', 'bob.r@statefarm.com', null, 1],
      ['Workers Compensation', 'Texas Mutual', 'WC-2026-TX-003', 500000.00, 1000.00, 620.00, 7440.00, '2026-01-01', '2027-01-01', 'active', 'Amy Chen', '(555) 500-0002', 'amy.c@texasmutual.com', null, 1],
      ['Umbrella Policy', 'State Farm', 'UMB-2026-TX-004', 5000000.00, 10000.00, 210.00, 2520.00, '2026-01-01', '2027-01-01', 'active', 'Bob Richardson', '(555) 500-0001', 'bob.r@statefarm.com', null, 1],
      ['Inland Marine (Equipment)', 'Hartford', 'IM-2026-TX-005', 150000.00, 2500.00, 125.00, 1500.00, '2026-01-01', '2027-01-01', 'active', 'Steve Park', '(555) 500-0003', 'steve.p@hartford.com', null, 1],
      ['Pollution Liability', 'Ironshore', 'PL-2026-TX-006', 1000000.00, 5000.00, 185.00, 2220.00, '2026-01-01', '2027-01-01', 'active', 'Jane Miller', '(555) 500-0004', 'jane.m@ironshore.com', null, 1],
      ['Professional Liability (E&O)', 'Hiscox', 'EO-2026-TX-007', 1000000.00, 2500.00, 95.00, 1140.00, '2026-01-01', '2027-01-01', 'active', 'Tom Walsh', '(555) 500-0005', 'tom.w@hiscox.com', null, 1],
      ['Commercial Property', 'State Farm', 'CP-2026-TX-008', 500000.00, 5000.00, 290.00, 3480.00, '2026-01-01', '2027-01-01', 'active', 'Bob Richardson', '(555) 500-0001', 'bob.r@statefarm.com', null, 1],
      ['General Liability - SA', 'State Farm', 'GL-2026-TX-009', 2000000.00, 5000.00, 380.00, 4560.00, '2026-01-01', '2027-01-01', 'active', 'Bob Richardson', '(555) 500-0001', 'bob.r@statefarm.com', null, 3],
      ['Commercial Auto - SA', 'State Farm', 'CA-2026-TX-010', 1000000.00, 2500.00, 320.00, 3840.00, '2026-01-01', '2027-01-01', 'active', 'Bob Richardson', '(555) 500-0001', 'bob.r@statefarm.com', null, 3],
      ['Surety Bond', 'Travelers', 'SB-2026-TX-011', 25000.00, 0, 25.00, 300.00, '2026-01-01', '2027-01-01', 'active', 'Mark Dean', '(555) 500-0006', 'mark.d@travelers.com', null, 1],
      ['Cyber Liability', 'Coalition', 'CY-2026-TX-012', 250000.00, 1000.00, 42.00, 504.00, '2026-01-01', '2027-01-01', 'active', 'Sarah Holt', '(555) 500-0007', 'sarah.h@coalition.com', null, 1],
      ['Commercial Auto - Trailer', 'State Farm', 'CT-2026-TX-013', 100000.00, 1000.00, 65.00, 780.00, '2026-01-01', '2027-01-01', 'active', 'Bob Richardson', '(555) 500-0001', 'bob.r@statefarm.com', null, 1],
      ['Workers Comp - SA', 'Texas Mutual', 'WC-2026-TX-014', 500000.00, 1000.00, 310.00, 3720.00, '2026-01-01', '2027-01-01', 'active', 'Amy Chen', '(555) 500-0002', 'amy.c@texasmutual.com', null, 3],
      ['Hired & Non-Owned Auto', 'State Farm', 'HN-2026-TX-015', 500000.00, 1000.00, 45.00, 540.00, '2026-01-01', '2027-01-01', 'active', 'Bob Richardson', '(555) 500-0001', 'bob.r@statefarm.com', null, 1],
    ];

    for (const ins of insuranceData) {
      await client.query(
        `INSERT INTO insurance_certificates (policy_type, provider, policy_number, coverage_amount, deductible, premium_monthly, premium_annual, start_date, end_date, status, agent_name, agent_phone, agent_email, document_url, location_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
        ins
      );
    }
    console.log('Insurance certificates seeded.');

    // ========================================================
    // 21. ENVIRONMENTAL COMPLIANCE
    // ========================================================
    const envData = [
      ['Wastewater Discharge Permit', 'City of Austin stormwater permit for pressure washing operations', 'City of Austin', 'WW-ATX-2026-001', 'Austin Water - Watershed Protection', 'compliant', '2026-01-01', '2027-01-01', 'Vacuum recovery + filter', true, true, 'Licensed waste hauler pickup', null, 1, 1, '2026-02-15', '2026-08-15'],
      ['TCEQ General Permit', 'Texas Commission on Environmental Quality multi-sector general permit', 'State of Texas', 'TXR-050000-2026', 'TCEQ', 'compliant', '2026-01-01', '2027-01-01', 'Best management practices', true, true, 'Per TCEQ guidelines', null, 1, 1, '2026-01-10', '2026-07-10'],
      ['Stormwater Pollution Prevention', 'SWPPP for commercial pressure washing activities', 'City of Austin', 'SWPPP-ATX-2026-003', 'Austin Watershed Protection', 'compliant', '2026-01-01', '2027-01-01', 'Berms + vacuum + filter', true, true, 'Sediment filter + licensed disposal', null, 1, 1, '2026-01-15', '2026-07-15'],
      ['Chemical Storage Permit', 'Permit for on-site chemical storage exceeding threshold quantities', 'Travis County', 'CS-TC-2026-004', 'Travis County Fire Marshal', 'compliant', '2026-01-01', '2027-01-01', null, false, false, 'Secondary containment + manifest', null, 1, 1, '2025-12-01', '2026-12-01'],
      ['SA Wastewater Permit', 'San Antonio wastewater discharge permit', 'City of San Antonio', 'WW-SA-2026-005', 'SAWS', 'compliant', '2026-01-01', '2027-01-01', 'Vacuum recovery + filter', true, true, 'Licensed waste hauler', null, 3, 2, '2026-02-20', '2026-08-20'],
      ['Round Rock Discharge Permit', 'Wastewater discharge permit for Round Rock operations', 'City of Round Rock', 'WW-RR-2026-006', 'Round Rock Utilities', 'compliant', '2026-03-01', '2027-03-01', 'Vacuum recovery', true, true, 'Licensed waste hauler', null, 4, 2, '2026-03-01', '2026-09-01'],
      ['SDS Compliance Records', 'Safety Data Sheet compliance for all chemicals on-site and in vehicles', 'OSHA', 'SDS-OSHA-2026-007', 'OSHA', 'compliant', '2026-01-01', null, null, false, false, null, null, 1, 1, '2026-03-01', '2026-09-01'],
      ['Spill Response Plan', 'Chemical spill response and notification plan', 'Travis County', 'SRP-TC-2026-008', 'Travis County Emergency Services', 'compliant', '2026-01-01', '2027-01-01', 'Spill kit + absorbent + containment', false, false, 'Haz-mat contractor on retainer', null, 1, 1, '2025-12-15', '2026-12-15'],
      ['Vehicle Emissions Compliance', 'Diesel vehicle emissions compliance for fleet', 'State of Texas', 'VE-TX-2026-009', 'TxDMV', 'compliant', '2026-01-01', '2027-01-01', null, false, false, null, null, 1, 1, '2026-01-05', '2026-07-05'],
      ['Georgetown Discharge Permit', 'Wastewater permit for Georgetown operations', 'City of Georgetown', 'WW-GT-2026-010', 'Georgetown Utility Systems', 'pending', '2026-04-01', '2027-04-01', 'Vacuum recovery', true, false, 'Licensed waste hauler', null, 5, null, null, '2026-10-01'],
      ['Water Reclaim System Certification', 'Certification for water reclaim/recycling system', 'City of Austin', 'WR-ATX-2026-011', 'Austin Water', 'compliant', '2026-01-01', '2027-01-01', 'Closed-loop reclaim with filtration', true, true, 'Recycled water reuse', null, 1, 1, '2026-02-01', '2026-08-01'],
      ['Hazmat Transportation', 'DOT hazardous materials transportation compliance', 'Federal DOT', 'HM-DOT-2026-012', 'USDOT FMCSA', 'compliant', '2026-01-01', '2027-01-01', null, false, false, 'DOT placarding and shipping papers', null, 1, 1, '2026-01-20', '2026-07-20'],
      ['Noise Ordinance Compliance', 'Operating within city noise ordinance limits - documented', 'City of Austin', 'NO-ATX-2026-013', 'Austin Code Enforcement', 'compliant', '2026-01-01', null, null, false, false, null, null, 1, 1, '2026-01-01', null],
      ['Cedar Park Discharge Permit', 'Wastewater discharge permit for Cedar Park', 'City of Cedar Park', 'WW-CP-2026-014', 'Cedar Park Utilities', 'pending', '2026-05-01', '2027-05-01', 'Vacuum recovery', true, false, 'Licensed waste hauler', null, 6, null, null, '2026-11-01'],
      ['Annual Environmental Audit', 'Comprehensive annual environmental compliance audit', 'Internal', 'EA-INT-2026-015', 'Internal / Third Party Auditor', 'compliant', '2026-01-15', '2027-01-15', 'All methods reviewed', true, true, 'All methods reviewed', null, 1, 1, '2026-01-15', '2027-01-15'],
    ];

    for (const e of envData) {
      await client.query(
        `INSERT INTO environmental_compliance (compliance_type, description, jurisdiction, permit_number, issuing_authority, status, effective_date, expiry_date, wastewater_method, reclaim_system, berm_required, chemical_disposal_method, document_url, location_id, reviewed_by, last_audit_date, next_audit_date)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        e
      );
    }
    console.log('Environmental compliance seeded.');

    // ========================================================
    // 22. TRAINING RECORDS
    // ========================================================
    const trainingData = [
      [4, 'Safety', 'OSHA 10-Hour Construction Safety', 'General industry safety training covering hazard recognition', 'OSHA Training Institute', 'OSHA-10-2025-CR001', '2025-06-15', '2030-06-15', null, true, null, 10.0, 'completed'],
      [5, 'Safety', 'OSHA 10-Hour Construction Safety', 'General industry safety training', 'OSHA Training Institute', 'OSHA-10-2025-DT001', '2025-07-20', '2030-07-20', null, true, null, 10.0, 'completed'],
      [6, 'Safety', 'OSHA 10-Hour Construction Safety', 'General industry safety training', 'OSHA Training Institute', 'OSHA-10-2025-MJ001', '2025-08-10', '2030-08-10', null, true, null, 10.0, 'completed'],
      [4, 'Technical', 'Soft Wash Systems Certification', 'Advanced soft wash techniques, chemical ratios, and equipment operation', 'Southeast Softwash Academy', 'SESW-CERT-2025-001', '2025-09-01', '2027-09-01', 95.00, true, null, 16.0, 'completed'],
      [5, 'Technical', 'Surface Cleaner & Flatwork Mastery', 'Advanced surface cleaning techniques and pattern prevention', 'PWNA Online', 'PWNA-SC-2025-001', '2025-10-15', '2027-10-15', 88.00, true, null, 8.0, 'completed'],
      [6, 'Technical', 'Commercial Pressure Washing Certification', 'Large-scale commercial wash operations and bidding', 'PWNA', 'PWNA-COM-2025-001', '2025-11-01', '2027-11-01', 92.00, true, null, 16.0, 'completed'],
      [7, 'Safety', 'Chemical Handling & SDS Training', 'Proper chemical handling, storage, and emergency procedures', 'In-house', null, '2026-01-10', '2027-01-10', null, true, null, 4.0, 'completed'],
      [8, 'Safety', 'Chemical Handling & SDS Training', 'Proper chemical handling, storage, and emergency procedures', 'In-house', null, '2026-01-10', '2027-01-10', null, true, null, 4.0, 'completed'],
      [9, 'Safety', 'Chemical Handling & SDS Training', 'Proper chemical handling, storage, and emergency procedures', 'In-house', null, '2026-01-10', '2027-01-10', null, true, null, 4.0, 'completed'],
      [4, 'Equipment', 'Hydro Tek Hot Water Skid Operation', 'Manufacturer training on hot water pressure washer operation and maintenance', 'Hydro Tek Factory', 'HT-OP-2025-001', '2025-06-20', null, null, true, null, 8.0, 'completed'],
      [7, 'Technical', 'Roof Cleaning Safety & Technique', 'Safe roof cleaning practices, chemical application, plant protection', 'RCIA', 'RCIA-2026-001', '2026-02-15', '2028-02-15', 90.00, true, null, 12.0, 'completed'],
      [10, 'Safety', 'First Aid & CPR', 'American Red Cross First Aid/CPR/AED certification', 'American Red Cross', 'ARC-FA-2026-001', '2026-01-20', '2028-01-20', null, true, null, 8.0, 'completed'],
      [11, 'Safety', 'First Aid & CPR', 'American Red Cross First Aid/CPR/AED certification', 'American Red Cross', 'ARC-FA-2026-002', '2026-01-20', '2028-01-20', null, true, null, 8.0, 'completed'],
      [1, 'Business', 'PWNA Certified Technician', 'Power Washers of North America full certification program', 'PWNA', 'PWNA-CT-2024-001', '2024-05-01', '2026-05-01', 96.00, true, null, 40.0, 'completed'],
      [12, 'Technical', 'Wood Restoration Specialist', 'Deck and fence cleaning, brightening, staining techniques', 'In-house', null, '2026-03-01', '2027-03-01', null, true, null, 8.0, 'completed'],
      [13, 'Safety', 'Ladder Safety & Fall Prevention', 'Proper ladder setup, 3-point contact, fall prevention', 'In-house', null, '2026-02-01', '2027-02-01', null, true, null, 2.0, 'completed'],
    ];

    for (const t of trainingData) {
      await client.query(
        `INSERT INTO training_records (user_id, training_type, title, description, provider, certification_number, completed_date, expiry_date, score, passed, document_url, hours, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        t
      );
    }
    console.log('Training records seeded.');

    // ========================================================
    // 23. REFERRALS
    // ========================================================
    const referralsData = [
      [1, 2, 'REF-001', 'John Peterson', 'Mary Sullivan', 'mary.sullivan@email.com', '(555) 301-1002', 'completed', 'discount', 50.00, true, '2026-02-15'],
      [2, 3, 'REF-002', 'Mary Sullivan', 'Robert Chen', 'robert.chen@email.com', '(555) 301-1003', 'completed', 'discount', 50.00, true, '2026-03-01'],
      [1, 5, 'REF-003', 'John Peterson', 'David Martinez', 'david.m@email.com', '(555) 301-1005', 'completed', 'discount', 50.00, true, '2026-03-05'],
      [4, 7, 'REF-004', 'Jennifer Williams', 'Michael Davis', 'michael.davis@email.com', '(555) 301-1007', 'completed', 'credit', 75.00, true, '2026-03-10'],
      [6, 16, 'REF-005', 'Patricia Thompson', 'Karen Patel', 'karen.patel@email.com', '(555) 301-1016', 'completed', 'discount', 50.00, true, '2026-03-15'],
      [10, null, 'REF-006', 'Barbara Wilson', 'Tom Harris', 'tom.harris@email.com', '(555) 400-0001', 'pending', 'discount', 50.00, false, null],
      [7, null, 'REF-007', 'Michael Davis', 'Sarah Kim', 'sarah.kim@email.com', '(555) 400-0002', 'pending', 'credit', 75.00, false, null],
      [2, null, 'REF-008', 'Mary Sullivan', 'James Wright', 'james.wright@email.com', '(555) 400-0003', 'contacted', 'discount', 50.00, false, null],
      [5, null, 'REF-009', 'David Martinez', 'Rosa Hernandez', 'rosa.h@email.com', '(555) 400-0004', 'contacted', 'discount', 50.00, false, null],
      [4, null, 'REF-010', 'Jennifer Williams', 'Bill Tucker', 'bill.tucker@email.com', '(555) 400-0005', 'pending', 'credit', 75.00, false, null],
      [8, null, 'REF-011', 'Linda Garcia', 'Mike Sanchez', 'mike.sanchez@email.com', '(555) 400-0006', 'pending', 'discount', 50.00, false, null],
      [3, null, 'REF-012', 'Robert Chen', 'Emily Zhang', 'emily.z@email.com', '(555) 400-0007', 'expired', 'discount', 50.00, false, null],
      [9, null, 'REF-013', 'William Brown', 'Chris Adams', 'chris.a@email.com', '(555) 400-0008', 'pending', 'discount', 50.00, false, null],
      [1, 10, 'REF-014', 'John Peterson', 'Barbara Wilson', 'barbara.w@email.com', '(555) 301-1010', 'completed', 'discount', 50.00, true, '2026-02-20'],
      [16, null, 'REF-015', 'Karen Patel', 'Liam OConnor', 'liam.oc@email.com', '(555) 400-0009', 'pending', 'credit', 75.00, false, null],
    ];

    for (const r of referralsData) {
      await client.query(
        `INSERT INTO referrals (referrer_customer_id, referred_customer_id, referral_code, referrer_name, referred_name, referred_email, referred_phone, status, reward_type, reward_amount, reward_issued, reward_issued_date)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        r
      );
    }
    console.log('Referrals seeded.');

    // ========================================================
    // 24. BOOKINGS
    // ========================================================
    const bookingsData = [
      ['BK-2026-001', null, 1, 1, 'Tom', 'Harris', 'tom.harris@email.com', '(555) 400-0001', '456 Live Oak Dr', 'Austin', 'TX', '78745', '2026-04-05', 'Morning', 2200, 'House wash - front and back heavy mildew', 'website', 'pending', null, null],
      ['BK-2026-002', null, 3, 1, 'Sarah', 'Kim', 'sarah.kim@email.com', '(555) 400-0002', '789 Bluebonnet Ln', 'Lakeway', 'TX', '78734', '2026-04-08', 'Afternoon', 3500, 'Full house wash and driveway', 'website', 'pending', null, null],
      ['BK-2026-003', null, 2, 1, 'James', 'Wright', 'james.wright@email.com', '(555) 400-0003', '120 Heritage Oaks Dr', 'Austin', 'TX', '78759', '2026-04-10', 'Morning', 2800, 'Roof has black streaks - need soft wash', 'google', 'pending', null, null],
      ['BK-2026-004', null, 3, 4, 'Rosa', 'Hernandez', 'rosa.h@email.com', '(555) 400-0004', '340 Settler Way', 'Round Rock', 'TX', '78664', '2026-04-12', 'Any', 500, 'Driveway and sidewalk cleaning', 'yelp', 'confirmed', null, null],
      ['BK-2026-005', null, 4, 5, 'Bill', 'Tucker', 'bill.tucker@email.com', '(555) 400-0005', '560 Liberty Hill Rd', 'Georgetown', 'TX', '78626', '2026-04-15', 'Morning', 1200, 'Deck and pergola need cleaning and brightening', 'referral', 'pending', null, null],
      ['BK-2026-006', 1, 1, 1, 'John', 'Peterson', 'john.peterson@email.com', '(555) 301-1001', '1234 Elm St', 'Austin', 'TX', '78745', '2026-06-15', 'Morning', 2400, 'Annual house wash - returning customer', 'website', 'confirmed', null, null],
      ['BK-2026-007', null, 14, 1, 'Alex', 'Petrov', 'alex.p@email.com', '(555) 400-0010', '890 Vintage Blvd', 'Austin', 'TX', '78745', '2026-04-18', 'Afternoon', null, 'Paver patio cleaning and re-sanding quote', 'instagram', 'pending', null, null],
      ['BK-2026-008', null, 16, 1, 'Naomi', 'Tanaka', 'naomi.t@email.com', '(555) 400-0011', '230 Solar Panel Way', 'Austin', 'TX', '78745', '2026-04-20', 'Morning', null, '24 solar panels need cleaning', 'google', 'pending', null, null],
      ['BK-2026-009', null, 1, 7, 'Mike', 'Sanchez', 'mike.sanchez@email.com', '(555) 400-0006', '445 Pecan Grove Ct', 'Pflugerville', 'TX', '78660', '2026-04-22', 'Any', 1800, 'House wash - single story', 'nextdoor', 'pending', null, null],
      ['BK-2026-010', null, 12, 1, 'Emily', 'Zhang', 'emily.z@email.com', '(555) 400-0007', '670 Graffiti Wall St', 'Austin', 'TX', '78702', '2026-04-25', 'ASAP', null, 'Graffiti on building side - need removal ASAP', 'phone', 'confirmed', null, null],
      ['BK-2026-011', null, 6, 1, 'Chris', 'Adams', 'chris.a@email.com', '(555) 400-0008', '112 Window Way', 'Austin', 'TX', '78745', '2026-04-28', 'Any', null, 'Window cleaning for 2-story home, ~40 panes', 'website', 'pending', null, null],
      ['BK-2026-012', null, 7, 1, 'Liam', 'OConnor', 'liam.oc@email.com', '(555) 400-0009', '555 Pool Party Ln', 'Dripping Springs', 'TX', '78620', '2026-05-01', 'Morning', 800, 'Pool deck and screen enclosure cleaning', 'referral', 'pending', null, null],
      ['BK-2026-013', 2, 2, 1, 'Mary', 'Sullivan', 'mary.sullivan@email.com', '(555) 301-1002', '5678 Oak Ave', 'Austin', 'TX', '78759', '2026-07-01', 'Morning', 3200, 'Semi-annual house and roof wash', 'website', 'confirmed', null, null],
      ['BK-2026-014', null, 11, 1, 'Dan', 'Foster', 'dan.foster@email.com', '(555) 400-0012', '900 Fleet St', 'Austin', 'TX', '78753', '2026-05-05', 'Any', null, 'Fleet wash quote - 15 delivery vans', 'phone', 'pending', null, null],
      ['BK-2026-015', null, 13, 1, 'Patricia', 'Nguyen', 'pat.n@email.com', '(555) 400-0013', '234 Rusty Gate Dr', 'Austin', 'TX', '78745', '2026-05-08', 'Afternoon', null, 'Rust stains on driveway from sprinklers', 'google', 'pending', null, null],
    ];

    for (const b of bookingsData) {
      await client.query(
        `INSERT INTO bookings (booking_number, customer_id, service_id, location_id, first_name, last_name, email, phone, address_line1, city, state, zip_code, preferred_date, preferred_time, property_sqft, description, source, status, converted_to_quote_id, converted_to_job_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
        b
      );
    }
    console.log('Bookings seeded.');

    // ========================================================
    // 25. REVIEWS
    // ========================================================
    const reviewsData = [
      [1, 1, 5, 'Absolutely spotless!', 'Mike and his crew did an amazing job on our house. The hardie board looks brand new. They were professional, on time, and cleaned up after themselves. Highly recommend!', 5, 5, 5, 5, true, true, 'Thank you John! We appreciate the kind words. See you next year!', '2026-03-12', 'google', null],
      [2, 2, 5, 'Roof looks brand new', 'Our metal roof had terrible algae streaks. The soft wash treatment made it look like the day it was installed. Very careful with our landscaping too.', 5, 5, 5, 5, true, true, 'Thanks Mary! Those algae streaks didnt stand a chance.', '2026-03-13', 'google', null],
      [4, 4, 5, 'Deck restoration miracle', 'Our Trex deck was gray and covered in mold. After their treatment it looks amazing. They even recommended a maintenance plan. Top notch service!', 5, 5, 5, 4, true, true, null, null, 'yelp', null],
      [5, 5, 4, 'Great driveway cleaning', 'Driveway looks 10 years younger. Only reason for 4 stars is I wish they could have gotten the oil stain out completely, but they warned me about that upfront.', 4, 5, 5, 4, true, true, 'Thanks David! Oil stains in concrete can be tough. The hot water treatment we discussed would get the rest out.', '2026-03-15', 'google', null],
      [7, 6, 5, 'Gutters are white again!', 'The tiger stripes on our gutters were driving me crazy. These guys made them look brand new. Worth every penny.', 5, 5, 5, 5, true, true, null, null, 'internal', null],
      [11, 7, 5, 'Professional commercial service', 'We manage Hill Country Plaza and this company does excellent work. Night crew is reliable and thorough. Building always looks pristine for Monday morning.', 5, 5, 5, 5, true, true, 'Thank you Thomas. We take pride in our commercial work and appreciate the partnership.', '2026-03-18', 'google', null],
      [8, null, 4, 'Good house wash', 'Nice job on our vinyl siding. Quick and efficient. Showed up on time. Could improve communication about arrival time.', 4, 4, 3, 4, true, true, 'Thanks Linda! We are working on better day-of notifications. Appreciate the feedback.', '2026-03-20', 'google', null],
      [3, null, 5, 'Best in Round Rock', 'Third time using them for our concrete work. Always consistent results. The surface cleaner leaves perfect lines every time.', 5, 5, 5, 5, true, true, null, null, 'nextdoor', null],
      [6, null, 5, 'Worth every penny for our estate', 'Our 3-story stone home is not easy to clean. They had the right equipment and knew exactly how to handle each surface. The stone looks gorgeous.', 5, 5, 4, 4, true, true, null, null, 'internal', null],
      [16, null, 5, 'Amazing results in the hill country', 'Brought their own water which was great since we are on well water. House and deck look incredible. Already signed up for their maintenance plan.', 5, 5, 5, 5, true, true, 'Thanks Karen! Smart choice on the maintenance plan. See you in June!', '2026-03-22', 'google', null],
      [12, 8, 5, 'Our retail center sparkles', 'Monthly storefront cleaning keeps our tenants happy. Very reliable service and fair pricing for commercial work.', 5, 5, 5, 5, true, true, null, null, 'google', null],
      [9, null, 4, 'Solid work on our deck', 'Deck and fence look great. Wood brightener really made a difference. Took a little longer than estimated but results speak for themselves.', 4, 5, 3, 4, true, true, null, null, 'yelp', null],
      [10, null, 5, 'Quick and clean', 'Had our patio and walkways done. In and out in about 90 minutes and everything looks perfect. Fair price too.', 5, 5, 5, 5, true, true, null, null, 'internal', null],
      [15, null, 5, 'Fleet looks showroom ready', 'They wash our dealership lot monthly and the fleet vehicles weekly. Customers always comment on how clean everything is. Great for business.', 5, 5, 5, 5, true, true, null, null, 'google', null],
      [14, null, 4, 'Good apartment complex service', 'Managing 120 units is hard enough. Having reliable exterior cleaning makes a big difference. Tenants are happier and the property looks well-maintained.', 4, 5, 4, 4, true, true, null, null, 'internal', null],
    ];

    for (const rv of reviewsData) {
      await client.query(
        `INSERT INTO reviews (customer_id, job_id, rating, title, comment, service_quality, professionalism, punctuality, value_for_money, would_recommend, is_public, response, response_date, platform, external_review_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
        rv
      );
    }
    console.log('Reviews seeded.');

    // ========================================================
    // 26. MARKETING CAMPAIGNS
    // ========================================================
    const marketingData = [
      ['Spring Cleaning Special 2026', 'seasonal_promo', 'active', 'Google Ads', 'Homeowners 25-65', '2026-03-01', '2026-05-31', 2500.00, 1200.00, 45000, 1800, 42, 12, 4800.00, 300.00, 'SPRING26', 15.00, 'Spring house wash and driveway cleaning bundle discount', 1],
      ['Roof Wash Awareness', 'educational', 'active', 'Facebook', 'Homeowners 35-65', '2026-02-15', '2026-06-30', 1500.00, 800.00, 32000, 1200, 28, 8, 7200.00, 800.00, null, null, 'Educational content about roof algae and the importance of soft washing', 1],
      ['Google Local Services Ads', 'ppc', 'active', 'Google LSA', 'Local homeowners', '2026-01-01', '2026-12-31', 12000.00, 3200.00, 85000, 4500, 180, 65, 35000.00, 993.75, null, null, 'Google Guaranteed local services ads for all service areas', 1],
      ['Nextdoor Neighborhood Sponsor', 'sponsorship', 'active', 'Nextdoor', 'Austin neighborhoods', '2026-01-01', '2026-12-31', 3600.00, 900.00, 28000, 950, 35, 15, 8500.00, 844.44, null, null, 'Sponsored posts in target neighborhoods across Austin metro', 1],
      ['Referral Program Push', 'referral', 'active', 'Email', 'Existing customers', '2026-01-15', '2026-12-31', 500.00, 250.00, 800, 320, 15, 6, 3600.00, 1340.00, 'REFER50', null, 'Email campaign promoting $50 referral rewards to existing customers', 1],
      ['Commercial Contract Outreach', 'direct_mail', 'active', 'Direct Mail', 'Property managers', '2026-02-01', '2026-04-30', 2000.00, 1800.00, 500, 45, 8, 3, 12000.00, 566.67, null, null, 'Direct mail to 500 commercial property managers in Austin metro', 1],
      ['Summer Deck Season', 'seasonal_promo', 'scheduled', 'Instagram', 'Homeowners 30-55', '2026-05-01', '2026-08-31', 1800.00, 0, 0, 0, 0, 0, 0, null, 'DECK26', 10.00, 'Deck cleaning and restoration before summer entertaining season', 1],
      ['HOA Partnership Program', 'partnership', 'active', 'Email + In-person', 'HOA boards', '2026-01-01', '2026-12-31', 1000.00, 400.00, 200, 60, 12, 5, 15000.00, 3650.00, 'HOA10', 10.00, 'Dedicated outreach to HOA boards for community-wide contracts', 1],
      ['Yelp Enhanced Listing', 'listing', 'active', 'Yelp', 'Local searchers', '2026-01-01', '2026-12-31', 4800.00, 1200.00, 15000, 800, 22, 8, 4200.00, 250.00, null, null, 'Enhanced Yelp business listing with photos and call tracking', 1],
      ['YouTube Before/After Series', 'content', 'active', 'YouTube', 'DIY homeowners 25-55', '2026-01-01', '2026-12-31', 600.00, 150.00, 52000, 2100, 8, 3, 1800.00, 1100.00, null, null, 'Weekly before/after transformation videos with tips and techniques', 1],
      ['San Antonio Market Launch', 'market_launch', 'completed', 'Multi-channel', 'SA homeowners + commercial', '2025-10-01', '2026-01-31', 5000.00, 5000.00, 60000, 3200, 95, 28, 18000.00, 260.00, 'SALAUNCH', 20.00, 'Multi-channel launch campaign for San Antonio market expansion', 3],
      ['Vehicle Wrap Advertising', 'outdoor', 'active', 'Vehicle wraps', 'All drivers in service area', '2025-06-01', '2027-06-01', 8000.00, 8000.00, null, null, 45, 18, 12000.00, 50.00, null, null, 'Full vehicle wraps on 5 fleet trucks with phone number and website', 1],
      ['Google Reviews Campaign', 'reputation', 'active', 'Email/SMS', 'Completed customers', '2026-01-01', '2026-12-31', 200.00, 50.00, 400, 180, null, null, null, null, null, null, 'Automated review request emails sent after job completion', 1],
      ['Round Rock Community Event', 'event', 'completed', 'In-person', 'Round Rock residents', '2026-02-15', '2026-02-15', 800.00, 800.00, 500, null, 22, 8, 4500.00, 462.50, 'RRFEST', 10.00, 'Booth at Round Rock community festival with live demo', 4],
      ['Fall Gutter Season Email', 'seasonal_promo', 'draft', 'Email', 'Existing customers', '2026-09-01', '2026-11-30', 300.00, 0, 0, 0, 0, 0, 0, null, 'GUTTER26', 15.00, 'Pre-fall gutter cleaning promotion to existing customer base', 1],
    ];

    for (const mc of marketingData) {
      await client.query(
        `INSERT INTO marketing_campaigns (name, campaign_type, status, channel, target_audience, start_date, end_date, budget, spent, impressions, clicks, leads_generated, conversions, revenue_generated, roi_percent, promo_code, discount_percent, description, location_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
        mc
      );
    }
    console.log('Marketing campaigns seeded.');

    // ========================================================
    // 27. ROUTE SHEETS
    // ========================================================
    const routeData = [
      ['2026-03-10', 1, 1, 1, 'completed', 3, 6.0, 5.5, 85.0, 28500, 28585, 4.2, '{1}', '{1}', false, 'Residential day - all Austin central'],
      ['2026-03-11', 1, 1, 1, 'completed', 2, 5.0, 5.2, 62.0, 28585, 28647, 3.5, '{2}', '{1}', false, 'Roof wash day - extra chemical loaded'],
      ['2026-03-12', 1, 1, 1, 'completed', 2, 5.0, 5.5, 78.0, 28647, 28725, 4.0, '{4}', '{1}', false, 'Deck restoration - Williams ranch'],
      ['2026-03-13', 2, 2, 1, 'completed', 2, 3.0, 2.8, 45.0, 42100, 42145, 2.5, '{5}', '{1}', false, 'Concrete jobs - Pflugerville route'],
      ['2026-03-14', 1, 1, 1, 'completed', 2, 4.0, 3.8, 55.0, 28725, 28780, 3.0, '{6}', '{1}', false, 'Gutter and house wash route - Lakeway'],
      ['2026-03-15', 3, 3, 1, 'completed', 1, 5.0, 5.3, 32.0, 15200, 15232, 2.0, '{7}', '{1}', false, 'Commercial night job - Congress Ave'],
      ['2026-03-23', 3, 3, 1, 'in_progress', 1, 4.0, null, null, 15232, null, null, '{8}', '{1}', true, 'Lamar retail center - AI optimized route'],
      ['2026-03-25', 2, 2, 1, 'planned', 2, 3.0, null, null, null, null, null, '{3}', '{1}', true, 'Concrete route - Round Rock'],
      ['2026-03-26', 2, 2, 2, 'planned', 1, 4.0, null, null, null, null, null, '{9}', '{1}', true, 'Auto dealership parking lot - early AM'],
      ['2026-03-27', 1, 1, 1, 'planned', 2, 4.0, null, null, null, null, null, '{10}', '{1,2}', true, 'Residential route - Kyle and Austin south'],
      ['2026-03-28', 1, 1, 1, 'planned', 2, 5.0, null, null, null, null, null, '{11}', '{1}', true, 'Dripping Springs route - hill country'],
      ['2026-04-01', 1, 1, 1, 'planned', 1, 3.0, null, null, null, null, null, '{12}', '{1}', true, 'Thompson estate - Cedar Park'],
      ['2026-04-02', 2, 2, 1, 'planned', 1, 2.0, null, null, null, null, null, '{13}', '{1}', false, 'Concrete - Wilson patio'],
      ['2026-04-03', 1, 1, 1, 'planned', 1, 3.0, null, null, null, null, null, '{14}', '{1}', false, 'Deck work - Brown residence Buda'],
      ['2026-04-07', 3, 3, 1, 'planned', 1, 3.0, null, null, null, null, null, '{15}', '{1}', true, 'Commercial night - 6th St restaurant'],
    ];

    for (const rs of routeData) {
      await client.query(
        `INSERT INTO route_sheets (route_date, crew_id, vehicle_id, location_id, status, total_jobs, total_estimated_hours, total_actual_hours, total_miles, start_mileage, end_mileage, fuel_gallons, job_ids, route_order, optimized_by_ai, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
        rs
      );
    }
    console.log('Route sheets seeded.');

    // ========================================================
    // 28. TIME ENTRIES
    // ========================================================
    const timeData = [
      [4, 1, 1, '2026-03-10', '2026-03-10 07:30:00', '2026-03-10 16:00:00', 30, 8.00, 'work', 28.00, 224.00, 'Full day - house wash + travel', 30.2500, -97.7500, 30.2490, -97.7510, 1, 'approved'],
      [7, 1, 1, '2026-03-10', '2026-03-10 07:30:00', '2026-03-10 16:00:00', 30, 8.00, 'work', 18.00, 144.00, 'House wash assist', 30.2500, -97.7500, 30.2490, -97.7510, 1, 'approved'],
      [4, 2, 1, '2026-03-11', '2026-03-11 07:00:00', '2026-03-11 15:30:00', 30, 8.00, 'work', 28.00, 224.00, 'Roof soft wash - Sullivan', 30.3950, -97.7420, 30.3940, -97.7430, 1, 'approved'],
      [8, 2, 1, '2026-03-11', '2026-03-11 07:00:00', '2026-03-11 15:30:00', 30, 8.00, 'work', 18.00, 144.00, 'Roof wash ground support', 30.3950, -97.7420, 30.3940, -97.7430, 1, 'approved'],
      [4, 4, 1, '2026-03-12', '2026-03-12 07:30:00', '2026-03-12 16:30:00', 30, 8.50, 'work', 28.00, 238.00, 'Deck restoration - Williams', 30.6330, -97.6770, 30.6320, -97.6780, 1, 'approved'],
      [5, 5, 2, '2026-03-13', '2026-03-13 09:30:00', '2026-03-13 14:00:00', 30, 4.00, 'work', 25.00, 100.00, 'Concrete driveway - Martinez', 30.4520, -97.6200, 30.4510, -97.6210, 1, 'approved'],
      [9, 5, 2, '2026-03-13', '2026-03-13 09:30:00', '2026-03-13 14:00:00', 30, 4.00, 'work', 16.00, 64.00, 'Concrete assist', 30.4520, -97.6200, 30.4510, -97.6210, 1, 'approved'],
      [4, 6, 1, '2026-03-14', '2026-03-14 07:30:00', '2026-03-14 15:00:00', 30, 7.00, 'work', 28.00, 196.00, 'Gutter cleaning - Davis lake house', 30.3640, -97.9800, 30.3630, -97.9810, 1, 'approved'],
      [6, 7, 3, '2026-03-15', '2026-03-15 18:30:00', '2026-03-16 00:00:00', 0, 5.50, 'work', 30.00, 165.00, 'Night commercial - Hill Country Plaza', 30.2660, -97.7430, 30.2650, -97.7440, 1, 'approved'],
      [11, 7, 3, '2026-03-15', '2026-03-15 18:30:00', '2026-03-16 00:00:00', 0, 5.50, 'work', 18.00, 99.00, 'Night commercial assist', 30.2660, -97.7430, 30.2650, -97.7440, 1, 'approved'],
      [6, 8, 3, '2026-03-23', '2026-03-23 05:30:00', null, 0, null, 'work', 30.00, null, 'Lamar retail center - in progress', 30.2440, -97.7720, null, null, null, 'pending'],
      [12, 8, 3, '2026-03-23', '2026-03-23 05:30:00', null, 0, null, 'work', 18.00, null, 'Lamar retail assist - in progress', 30.2440, -97.7720, null, null, null, 'pending'],
      [4, null, null, '2026-03-09', '2026-03-09 08:00:00', '2026-03-09 12:00:00', 0, 4.00, 'training', 28.00, 112.00, 'New hire orientation - safety protocols', 30.2500, -97.7500, 30.2500, -97.7500, 1, 'approved'],
      [7, null, null, '2026-03-16', '2026-03-16 08:00:00', '2026-03-16 12:00:00', 0, 4.00, 'maintenance', 18.00, 72.00, 'Equipment maintenance and trailer cleanup', 30.2500, -97.7500, 30.2500, -97.7500, 1, 'approved'],
      [5, null, null, '2026-03-16', '2026-03-16 08:00:00', '2026-03-16 12:00:00', 0, 4.00, 'maintenance', 25.00, 100.00, 'Surface cleaner rebuild and hose inspection', 30.2500, -97.7500, 30.2500, -97.7500, 1, 'approved'],
    ];

    for (const te of timeData) {
      await client.query(
        `INSERT INTO time_entries (user_id, job_id, crew_id, entry_date, clock_in, clock_out, break_minutes, total_hours, entry_type, hourly_rate, total_pay, notes, gps_clock_in_lat, gps_clock_in_lng, gps_clock_out_lat, gps_clock_out_lng, approved_by, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
        te
      );
    }
    console.log('Time entries seeded.');

    // ========================================================
    // 29. AI LOGS
    // ========================================================
    const aiData = [
      [1, 'pricing', 'estimate_price', '{"service":"house_wash","sqft":2400,"stories":2,"siding":"hardie_board","condition":"moderate"}', '{"suggested_price":375.00,"confidence":0.925,"range_low":340,"range_high":410,"factors":["2-story premium","hardie board standard rate","moderate soiling"]}', 'gpt-4o', 850, 0.0255, 1200, 92.5, true, 'accurate', null, '{"quote_id":1}'],
      [1, 'pricing', 'estimate_price', '{"service":"roof_soft_wash","sqft":3200,"roof_type":"metal","condition":"heavy_algae"}', '{"suggested_price":900.00,"confidence":0.88,"range_low":850,"range_high":1100,"factors":["metal roof premium","heavy algae surcharge","3200sqft"]}', 'gpt-4o', 920, 0.0276, 1350, 88.0, true, 'accurate', null, '{"quote_id":2}'],
      [15, 'pricing', 'estimate_price', '{"service":"concrete_cleaning","sqft":450,"surface":"driveway","condition":"moderate"}', '{"suggested_price":155.00,"confidence":0.91,"range_low":130,"range_high":175,"factors":["standard driveway rate","moderate soiling","minimum price applies"]}', 'gpt-4o', 780, 0.0234, 980, 91.0, true, null, null, '{"quote_id":3}'],
      [1, 'scheduling', 'optimize_route', '{"date":"2026-03-10","crew_id":1,"jobs":[1],"start_location":"4500 Industrial Blvd Austin"}', '{"optimized_order":[1],"total_miles":22.5,"total_drive_time_min":35,"suggestions":["Start with Peterson - closest to HQ"]}', 'gpt-4o', 1200, 0.036, 2100, 95.0, true, 'helpful', null, '{"route_sheet_id":1}'],
      [1, 'scheduling', 'optimize_route', '{"date":"2026-03-23","crew_id":3,"jobs":[8],"start_location":"4500 Industrial Blvd Austin"}', '{"optimized_order":[8],"total_miles":15.2,"total_drive_time_min":22,"suggestions":["Early start for retail - before store hours"]}', 'gpt-4o', 1100, 0.033, 1800, 93.0, true, null, null, '{"route_sheet_id":7}'],
      [2, 'chemical', 'recommend_mix', '{"surface":"vinyl_siding","condition":"heavy_mildew","stories":2}', '{"primary":"SH 12.5%","ratio":"1:3 with water","surfactant":"Elemonator 1oz/gal","method":"downstream","dwell_time_min":10,"notes":"Pre-wet plants, rinse top-down"}', 'gpt-4o', 650, 0.0195, 890, 94.0, true, 'accurate', null, '{"job_id":1}'],
      [2, 'chemical', 'recommend_mix', '{"surface":"asphalt_shingle_roof","condition":"heavy_algae","method":"soft_wash"}', '{"primary":"SH 12.5%","ratio":"50/50 with water","surfactant":"Elemonator 1oz/gal","method":"soft_wash_pump","dwell_time_min":20,"notes":"Apply from ridge down, do not rinse - let rain wash"}', 'gpt-4o', 680, 0.0204, 920, 91.0, true, 'accurate', null, '{"job_id":2}'],
      [15, 'marketing', 'generate_copy', '{"campaign":"Spring Cleaning Special","channel":"google_ads","service":"house_wash"}', '{"headline":"Spring House Wash Special - 15% Off","description":"Professional soft wash removes years of dirt, mildew & algae. Licensed & insured. Free estimates!","cta":"Book Now"}', 'gpt-4o', 450, 0.0135, 750, null, true, 'good', null, '{"campaign_id":1}'],
      [1, 'customer', 'predict_churn', '{"customer_id":12,"last_service":"2025-08-15","total_services":3,"avg_rating":4.2}', '{"churn_risk":"low","score":0.15,"factors":["regular commercial contract","positive reviews","auto-renew enabled"],"recommendation":"Send thank you note and renewal reminder"}', 'gpt-4o', 550, 0.0165, 680, 85.0, null, null, null, null],
      [1, 'weather', 'check_conditions', '{"date":"2026-03-25","location":"Round Rock TX"}', '{"forecast":"Partly cloudy","high_f":78,"low_f":55,"rain_chance":10,"wind_mph":8,"recommendation":"Good conditions for pressure washing","alerts":[]}', 'gpt-4o', 320, 0.0096, 450, 98.0, true, null, null, '{"route_sheet_id":8}'],
      [16, 'support', 'chat_response', '{"query":"What chemicals do you use on my roof?","customer_id":2}', '{"response":"We use a sodium hypochlorite-based soft wash solution at safe concentrations, mixed with a biodegradable surfactant. This is the method recommended by roof manufacturers like GAF and CertainTeed. It safely kills algae and moss without damaging your shingles.","sources":["chemicals.id=1","chemicals.id=3"]}', 'gpt-4o', 890, 0.0267, 1100, null, null, null, null, null],
      [1, 'pricing', 'estimate_price', '{"service":"commercial_building_wash","sqft":25000,"stories":3,"surface":"glass_concrete","time":"night"}', '{"suggested_price":1800.00,"confidence":0.82,"range_low":1600,"range_high":2200,"factors":["3-story height premium","night work surcharge","glass care required","25000sqft commercial rate"]}', 'gpt-4o', 980, 0.0294, 1400, 82.0, true, 'accurate', null, '{"quote_id":8}'],
      [2, 'safety', 'hazard_assessment', '{"property_id":11,"job_type":"commercial_building_wash","time":"night"}', '{"hazards":["working at height","chemical exposure","low visibility","slip hazard"],"required_ppe":["hard_hat","safety_glasses","gloves","boots","reflective_vest"],"precautions":["cone off work area","use LED work lights","buddy system","chemical spill kit on-site"]}', 'gpt-4o', 720, 0.0216, 950, 90.0, true, 'helpful', null, '{"job_id":7}'],
      [1, 'invoicing', 'auto_generate', '{"job_id":1,"customer_id":1,"amount":389.70}', '{"invoice_number":"INV-2026-001","line_items":[{"description":"House Wash - 2400 sqft","qty":2400,"rate":0.15,"total":360.00}],"tax":29.70,"total":389.70,"payment_terms":"Due on receipt"}', 'gpt-4o', 600, 0.018, 800, 96.0, true, 'accurate', null, '{"invoice_id":1}'],
      [1, 'reporting', 'weekly_summary', '{"week_start":"2026-03-10","week_end":"2026-03-16","location_id":1}', '{"total_revenue":4202.57,"jobs_completed":6,"jobs_scheduled":0,"avg_rating":4.86,"top_service":"House Wash","crew_utilization":0.82,"chemical_usage":{"sh_gallons":45,"surfactant_oz":32},"recommendations":["Crew 2 has capacity for 2 more jobs","Reorder SH - stock below 50% threshold"]}', 'gpt-4o', 1500, 0.045, 2200, null, true, 'very_helpful', null, null],
    ];

    for (const ai of aiData) {
      await client.query(
        `INSERT INTO ai_logs (user_id, feature, action, input_data, output_data, model_used, tokens_used, cost, response_time_ms, confidence_score, was_accepted, feedback, error_message, metadata)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        ai
      );
    }
    console.log('AI logs seeded.');

    console.log('\n========================================');
    console.log('Database seeded successfully!');
    console.log('========================================');
    console.log('Admin login: admin@pressurewash.com / admin123');
    console.log('========================================\n');

  } catch (err) {
    console.error('Seed error:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
