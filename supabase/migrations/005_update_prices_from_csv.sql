-- Update service prices from updated CSV
-- This migration updates existing services with new prices and adds new services

-- Update Sound category prices
UPDATE services SET original_price = 1188, bows_price = 788 WHERE name = 'Ceremony Sound Package' AND category = 'sound';
UPDATE services SET original_price = 2288, bows_price = 1488 WHERE name = 'Dinner Reception Sound Package' AND category = 'sound';
UPDATE services SET original_price = 4488, bows_price = 2888 WHERE name = 'Live Band Sound Package' AND category = 'sound';

-- Update LED Walls category prices
UPDATE services SET original_price = 2888, bows_price = 1888 WHERE name = 'Signature Backdrop' AND category = 'led-walls';
UPDATE services SET original_price = 5888, bows_price = 3888 WHERE name = 'Signature Widescreen' AND category = 'led-walls';
UPDATE services SET original_price = 7888, bows_price = 5388 WHERE name = 'Signature Dual Screens' AND category = 'led-walls';

-- Update DJ category prices
UPDATE services SET original_price = 1488, bows_price = 888 WHERE name = 'Essential DJ' AND category = 'dj';
UPDATE services SET original_price = 2588, bows_price = 1588 WHERE name = 'Standard DJ' AND category = 'dj';
UPDATE services SET original_price = 4688, bows_price = 2888 WHERE name = 'Full-Day DJ' AND category = 'dj';

-- Delete old DJ Additional Hour if exists, then add new one as addon
DELETE FROM services WHERE name = 'DJ Additional Hour' AND category = 'dj';

INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order, is_addon, addon_price_per_unit) VALUES
('DJ Additional Hour', 'Additional hour for DJ service', 'dj', 388, 388, '/package-photos/Wedding DJ.png', true, 4, true, 388);

-- Update category name from 'emerging-band' to 'fresh-band' in the enum
-- Note: We need to rename the category first
DO $$
BEGIN
    -- Update existing records
    UPDATE services SET category = 'seasoned-band' WHERE category = 'emerging-band';
END $$;

-- Update Fresh Band (formerly Emerging Band) prices
UPDATE services SET original_price = 1588, bows_price = 988, description = '30 Minutes

Live music with a planned set list (no on-the-day song requests).

Includes:
• 4–6 piece live band
• Customised set list based on your brief
• Revisions to the set list confirmed before the event
• 30 Minutes of music: either 1 x 30 min or 2 x 15 min sets within a 1-hour window'
WHERE name = 'Emerging Essential' AND category = 'seasoned-band';

UPDATE services SET original_price = 2388, bows_price = 1488, name = 'Emerging Plus', description = '1 Hour

Live music with a planned set list (no on-the-day song requests).

Includes:
• 4–6 piece live band
• Customised set list based on your brief
• Revisions to the set list confirmed before the event
• 1 Hour of music: either 1 x 60 min or 2 x 30 min sets within a 2-hour window'
WHERE name = 'Emerging Plus' AND category = 'seasoned-band';

-- Update Professional Band (Seasoned Band) prices
UPDATE services SET original_price = 1988, bows_price = 1288 WHERE name = 'Essential Duo Set' AND category = 'seasoned-band';
UPDATE services SET original_price = 2388, bows_price = 1588 WHERE name = 'Signature Duo Set' AND category = 'seasoned-band';
UPDATE services SET original_price = 2788, bows_price = 1888 WHERE name = 'Premium Duo Set' AND category = 'seasoned-band';
UPDATE services SET original_price = 2788, bows_price = 1888 WHERE name = 'Essential Trio Set' AND category = 'seasoned-band';
UPDATE services SET original_price = 3188, bows_price = 2288 WHERE name = 'Signature Trio Set' AND category = 'seasoned-band';
UPDATE services SET original_price = 3688, bows_price = 2688 WHERE name = 'Premium Trio Set' AND category = 'seasoned-band';
UPDATE services SET original_price = 3488, bows_price = 2388 WHERE name = 'Essential Quartet Set' AND category = 'seasoned-band';
UPDATE services SET original_price = 4188, bows_price = 2888 WHERE name = 'Signature Quartet Set' AND category = 'seasoned-band';
UPDATE services SET original_price = 5088, bows_price = 3388 WHERE name = 'Premium Quartet Set' AND category = 'seasoned-band';
UPDATE services SET original_price = 4188, bows_price = 2888 WHERE name = 'Essential Quintet Set' AND category = 'seasoned-band';
UPDATE services SET original_price = 5288, bows_price = 3688 WHERE name = 'Signature Quintet Set' AND category = 'seasoned-band';
UPDATE services SET original_price = 6388, bows_price = 4488 WHERE name = 'Premium Quintet Set' AND category = 'seasoned-band';

-- Update Chinese Orchestra (Ensemble) prices
UPDATE services SET original_price = 1488, bows_price = 1088 WHERE name = 'Essential Solo Set' AND category = 'chinese-ensemble';
UPDATE services SET original_price = 1988, bows_price = 1388 WHERE name = 'Signature Solo Set' AND category = 'chinese-ensemble';
UPDATE services SET original_price = 2488, bows_price = 1688 WHERE name = 'Premium Solo Set' AND category = 'chinese-ensemble';
UPDATE services SET original_price = 3188, bows_price = 2188 WHERE name = 'Essential Ensemble Set' AND category = 'chinese-ensemble';
UPDATE services SET original_price = 4288, bows_price = 2988 WHERE name = 'Signature Ensemble Set' AND category = 'chinese-ensemble';

-- Update Emcee prices
UPDATE services SET original_price = 1488, bows_price = 988, description = '4 Hours

Includes:
• Complimentary 1 hour early arrival on AD
• 1 x Online consultation with the couple and planners
• Programme coordination and timekeeping
• Crowd engagement and guest guidance
• Liaison with DJ, live band and AV team
• *Additional hours @$150/h'
WHERE name = 'Emcee 4hr' AND category = 'emcee';

UPDATE services SET original_price = 180, bows_price = 180, addon_price_per_unit = 180 WHERE name = 'Emcee Additional Hour' AND category = 'emcee';

-- Update Stage Lighting prices
UPDATE services SET original_price = 1288, bows_price = 888 WHERE name = 'Atmosphere Lite' AND category = 'stage-lighting';
UPDATE services SET original_price = 2988, bows_price = 1988 WHERE name = 'Atmosphere Plus' AND category = 'stage-lighting';
UPDATE services SET original_price = 4488, bows_price = 2888 WHERE name = 'Atmosphere Pro' AND category = 'stage-lighting';

-- Update Photobooth prices
UPDATE services SET original_price = 988, bows_price = 688, description = 'Perfect for cocktails and pre-dinner moments.

A simple setup with instant prints and a full digital gallery for easy sharing.

Includes:
• Unlimited prints for up to 2 hours
• Digital copies of all photos after event
• Wedding-themed props box'
WHERE name = 'Classic Booth' AND category = 'photobooth';

UPDATE services SET original_price = 1688, bows_price = 1188, description = 'Designed for full reception coverage with higher throughput.

Upgraded backdrop, longer hours, more poses and prints.

Includes:
• Unlimited prints for up to 4 hours
• Digital copies of all photos after event
• Wedding-themed props box
• Custom photo frame design'
WHERE name = 'Deluxe Booth' AND category = 'photobooth';

-- Add new AI Photobooth services
INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order) VALUES
('Classic AI Booth', 'Perfect for cocktails and pre-dinner moments.

Our in-house AI app with instant prints and a full digital gallery for easy sharing.

Includes:
• Unlimited prints for up to 2 hours
• Digital copies of all photos after event
• Wedding-themed props box
• Standard AI Themes', 'photobooth', 1288, 888, '/package-photos/Photobooths.png', true, 6),

('Deluxe AI Booth', 'Best for full reception coverage and higher guest flow.

Longer hours, custom designs, more poses and prints.

Includes:
• Unlimited prints for up to 4 hours
• Digital copies of all photos after event
• Wedding-themed props box
• Custom photo frame design
• Custom AI Themes', 'photobooth', 2188, 1588, '/package-photos/Photobooths.png', true, 7)
ON CONFLICT DO NOTHING;

-- Update Photobooth add-ons
UPDATE services SET original_price = 288, bows_price = 288, addon_price_per_unit = 288 WHERE name = 'Photobooth Additional Hours' AND category = 'photobooth';

-- Remove old AI add-on and add new ones
DELETE FROM services WHERE name = 'Photobooth AI Add-on' AND category = 'photobooth';

INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order, is_addon, addon_price_per_unit) VALUES
('AI Photobooth Additional Hour', 'Additional hour for AI photobooth service', 'photobooth', 388, 388, '/package-photos/Photobooths.png', true, 8, true, 388)
ON CONFLICT DO NOTHING;

UPDATE services SET original_price = 128, bows_price = 128, addon_price_per_unit = 128 WHERE name = 'Photobooth Polaroid Camera' AND category = 'photobooth';

-- Photography prices remain the same, just update ROM Additional Hours
UPDATE services SET original_price = 250, bows_price = 250, addon_price_per_unit = 250 WHERE name = 'ROM Photography Additional Hours' AND category = 'photography';
UPDATE services SET original_price = 288, bows_price = 288, addon_price_per_unit = 288 WHERE name = 'Pre-Wedding Photography Additional Hours' AND category = 'photography';
UPDATE services SET original_price = 288, bows_price = 288, addon_price_per_unit = 288 WHERE name = 'Actual Day Photography Additional Hours' AND category = 'photography';
UPDATE services SET original_price = 158, bows_price = 158, addon_price_per_unit = 158 WHERE name = 'Actual Day Photography Additional Photographer' AND category = 'photography';
