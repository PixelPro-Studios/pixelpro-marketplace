-- Clear existing services first (to avoid enum conversion issues)
DELETE FROM order_items;
DELETE FROM services;

-- Now update service categories enum safely
ALTER TYPE service_category RENAME TO service_category_old;
CREATE TYPE service_category AS ENUM ('sound', 'led-walls', 'dj', 'emerging-band', 'seasoned-band', 'chinese-ensemble', 'emcee', 'stage-lighting', 'photobooth', 'photography');
ALTER TABLE services ALTER COLUMN category TYPE service_category USING category::text::service_category;
DROP TYPE service_category_old;

-- Add addon-related columns to services
ALTER TABLE services
ADD COLUMN IF NOT EXISTS is_addon BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS parent_service_id UUID REFERENCES services(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS addon_price_per_unit DECIMAL(10,2);

COMMENT ON COLUMN services.is_addon IS 'Whether this service is an add-on to another service';
COMMENT ON COLUMN services.parent_service_id IS 'Parent service ID if this is an add-on';
COMMENT ON COLUMN services.addon_price_per_unit IS 'Price per unit for add-on services (e.g., per hour)';

-- Insert Sound category services
INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order) VALUES
('Ceremony Sound Package', 'Clean, clear sound for your vows and speeches.

Includes:
• 2x Full-range Speakers
• 2x Wireless Microphones
• 1x Digital Mixer
• 1x On-Site Technician', 'sound', 900, 650, '/package-photos/Sound System and Mics.jpg', true, 1),

('Dinner Reception Sound Package', 'Clear, even sound for dinner and toasts.

Includes:
• 4x Full-range Speakers
• 1x Subwoofer
• 2x Wireless Microphones
• 2x Wired Microphones
• 1x Digital Mixer
• 1x Sound Engineer', 'sound', 2100, 1388, '/package-photos/Sound System and Mics.jpg', true, 2),

('Live Band Sound Package', 'A stage-ready setup for live music.

Includes:
• 6x Full-range Speakers
• 1x Subwoofer
• 2x Stage Monitors
• 4x Wireless Microphones
• 2x DI Boxes
• 1x Digital Mixer
• 1x On-Site Technician
• 1x Sound Engineer', 'sound', 4200, 2488, '/package-photos/Sound System and Mics.jpg', true, 3);

-- Insert LED Walls category services
INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order) VALUES
('Signature Backdrop', '3m x 2.5m LED Screen

Clean, photo-friendly display for names, monogram and montage.

Enhances the stage without overpowering the décor, or use it as a backdrop for photos.

Includes:
• 4K Video Processor
• On-Site Crew Support (6h)', 'led-walls', 2400, 1688, '/package-photos/LED Walls and Backdrops.jpg', true, 1),

('Signature Widescreen', '6m x 3m LED Screen

Wide, clear display for walk-ins, speeches and games in larger ballrooms.

Ensures all guests can see the content clearly.

Includes:
• Holding Screen Graphics
• 4K Video Processor
• On-Site Crew Support (6h)', 'led-walls', 5500, 3588, '/package-photos/LED Walls and Backdrops.jpg', true, 2),

('Signature Dual Screens', '8m x 3m LED Screens

Can be one wide screen or two matching side screens.

Allows split content (e.g. live camera + montage/monogram).

Includes:
• Holding Screen Graphics
• 2x 4K Video Processor
• On-Site Crew Support (6h)', 'led-walls', 8100, 4888, '/package-photos/LED Walls and Backdrops.jpg', true, 3);

-- Insert DJ category services
INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order) VALUES
('Essential DJ', '2 Hours

Music for a short programme, or a punchy after-party set.

Includes:
• 1x DJ
• Music planning (must-play/do-not-play)
• DJ style tailored to your brief
• Cue management for entrances and speeches', 'dj', 988, 688, '/package-photos/Wedding DJ.png', true, 1),

('Standard DJ', '4 Hours

Music coverage for reception and dinner, or an after-party.

Includes:
• 2x DJs on rotation
• Music planning (must-play/do-not-play)
• DJ style tailored to your brief
• Cue management for entrances and speeches', 'dj', 1788, 1188, '/package-photos/Wedding DJ.png', true, 2),

('Full-Day DJ', '8 Hours

Full-day DJ with after-party included.

Includes:
• Multiple DJs on rotation
• Music planning (must play/do-not-play)
• DJ style tailored to your brief
• Cue management for entrances and speeches
• 1x Venue change & transfer', 'dj', 3499, 2188, '/package-photos/Wedding DJ.png', true, 3);

-- Insert Emerging Wedding Band category services
INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order) VALUES
('Emerging Essential', '30 Minutes

Live music with a planned set list (no on-the-day song requests).

Includes:
• 4–6 piece live band
• Customised set list based on your brief
• Revisions to the set list confirmed before the event
• 30 Minutes of music: either 1 x 30 min or 2 x 15 min sets within a 1-hour window', 'emerging-band', 1288, 888, '/package-photos/Emerging Wedding Band.jpg', true, 1),

('Emerging Plus', '1 Hour

Live music with a planned set list (no on-the-day song requests).

Includes:
• 4–6 piece live band
• Customised set list based on your brief
• Revisions to the set list confirmed before the event
• 1 Hour of music: either 1 x 60 min or 2 x 30 min sets within a 2-hour window', 'emerging-band', 1888, 1288, '/package-photos/Emerging Wedding Band.jpg', true, 2);

-- Insert Seasoned Wedding Band category services
INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order) VALUES
('Essential Duo Set', '1 Hour

Live music by a seasoned 2-piece band with tailored accompaniment for your key moments.

Includes:
• 1x vocalist on guitar or keys + 1x instrumentalists
• 2x march-in accompaniments
• Pre-event consultation
• Customised song list unique to each couple', 'seasoned-band', 1788, 1088, '/package-photos/Seasoned Wedding Band.jpg', true, 1),

('Signature Duo Set', '1.5 Hours

A longer performance window with added interaction and requests.

Includes:
• 1x vocalist on guitar or keys + 1x instrumentalists
• 2x march-in accompaniments
• Pre-event consultation
• Customised song list unique to each couple
• Dedicated cards for song requests and well wishes', 'seasoned-band', 2188, 1388, '/package-photos/Seasoned Wedding Band.jpg', true, 2),

('Premium Duo Set', '2 Hours 15 Minutes

Extended coverage for dinners or programmes needing more live music and guest engagement.

Includes:
• 1x vocalist on guitar or keys + 1x instrumentalists
• 2x march-in accompaniments
• Pre-event consultation
• Customised song list unique to each couple
• Dedicated cards for song requests and well wishes', 'seasoned-band', 2488, 1688, '/package-photos/Seasoned Wedding Band.jpg', true, 3),

('Essential Trio Set', '1 Hour

Live music by an experienced 3-piece band, tailored to accompany your key wedding moments.

Includes:
• 1x vocalist on guitar or keys + 2x instrumentalists
• 2x march-in accompaniments
• Pre-event consultation
• Customised song list unique to each couple', 'seasoned-band', 2488, 1688, '/package-photos/Seasoned Wedding Band.jpg', true, 4),

('Signature Trio Set', '1.5 Hours

A longer set with added musical depth and light guest interaction.

Includes:
• 1x vocalist on guitar or keys + 2x instrumentalists
• 2× march-in accompaniments
• Pre-event consultation
• Customised song list unique to each couple
• Dedicated cards for song requests and well wishes', 'seasoned-band', 2988, 2088, '/package-photos/Seasoned Wedding Band.jpg', true, 5),

('Premium Trio Set', '2 Hours 15 Minutes

Extended coverage for dinners or programmes needing fuller live music and guest engagement.

Includes:
• 1x vocalist on guitar or keys + 2x instrumentalists
• 2x march-in accompaniments
• Pre-event consultation
• Customised song list unique to each couple
• Dedicated cards for song requests and well wishes', 'seasoned-band', 3588, 2488, '/package-photos/Seasoned Wedding Band.jpg', true, 6),

('Essential Quartet Set', '1 Hour

Live music by a seasoned 4-piece band, delivering a fuller sound for key wedding moments.

Includes:
• 1x vocalist on guitar or keys + 3x instrumentalists
• 2× march-in accompaniments
• Pre-event consultation
• Customised song list unique to each couple', 'seasoned-band', 3288, 2188, '/package-photos/Seasoned Wedding Band.jpg', true, 7),

('Signature Quartet Set', '1.5 Hours

A longer performance window with added musical richness and light guest interaction.

Includes:
• 1x vocalist on guitar or keys + 3x instrumentalists
• 2× march-in accompaniments
• Pre-event consultation
• Customised song list unique to each couple
• Dedicated cards for song requests and well wishes', 'seasoned-band', 3988, 2688, '/package-photos/Seasoned Wedding Band.jpg', true, 8),

('Premium Quartet Set', '2 Hours 15 Minutes

Extended coverage for dinners or programmes needing a full band sound and strong guest engagement.

Includes:
• 1x vocalist on guitar or keys + 3x instrumentalists
• 2× march-in accompaniments
• Pre-event consultation
• Customised song list unique to each couple
• Dedicated cards for song requests and well wishes', 'seasoned-band', 4888, 3288, '/package-photos/Seasoned Wedding Band.jpg', true, 9),

('Essential Quintet Set', '1 Hour

A seasoned 5-piece band delivering a rich, full arrangement for your key wedding moments.

Includes:
• 1x vocalist on guitar or keys + 4x instrumentalists
• 2× march-in accompaniments
• Pre-event consultation
• Customised song list unique to each couple', 'seasoned-band', 3888, 2688, '/package-photos/Seasoned Wedding Band.jpg', true, 10),

('Signature Quintet Set', '1.5 Hours

A longer performance window with enhanced musical depth and light guest interaction.

Includes:
• 1x vocalist on guitar or keys + 4x instrumentalists
• 2× march-in accompaniments
• Pre-event consultation
• Customised song list unique to each couple
• Dedicated cards for song requests and well wishes', 'seasoned-band', 4888, 3388, '/package-photos/Seasoned Wedding Band.jpg', true, 11),

('Premium Quintet Set', '2 Hours 15 Minutes

Extended coverage for dinners or programmes requiring a full-band sound and strong guest engagement.

Includes:
• 1x vocalist on guitar or keys + 4x instrumentalists
• 2× march-in accompaniments
• Pre-event consultation
• Customised song list unique to each couple
• Dedicated cards for song requests and well wishes', 'seasoned-band', 5888, 4088, '/package-photos/Seasoned Wedding Band.jpg', true, 12);

-- Insert Chinese Ensemble category services
INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order) VALUES
('Essential Solo Set', '30 Minutes

Pure instrumental performance on guzheng from a planned set list (no on-the-day song requests).

Includes:
• One soloist on guzheng
• Customised set list tailored to your brief
• 1–2 Sets, totalling 30 minutes within a 1 hour window', 'chinese-ensemble', 1288, 888, '/package-photos/Chinese Ensemble.jpg', true, 1),

('Signature Solo Set', '1 Hour

Pure instrumental performance on guzheng from a planned set list (no on-the-day song requests).

Includes:
• One soloist on guzheng
• Customised set list tailored to your brief
• 3–4 Sets totalling 60 minutes within a 2 hour window', 'chinese-ensemble', 1788, 1188, '/package-photos/Chinese Ensemble.jpg', true, 2),

('Premium Solo Set', '1.5 Hours

Pure instrumental performance on guzheng from a planned set list (no on-the-day song requests).

Includes:
• One soloist on guzheng
• Customised set list tailored to your brief
• Split Sets totalling 90 minutes within a 3 hour window', 'chinese-ensemble', 2288, 1488, '/package-photos/Chinese Ensemble.jpg', true, 3),

('Essential Ensemble Set', '1 Hour

Refined trio on traditional Chinese instruments playing from a planned set list (no on-the-day requests).

Includes:
• Trio line up featuring dizi, guzheng and cello
• Customised set list based on your brief
• 1–2 sets totalling 60 minutes within a 2-hour window', 'chinese-ensemble', 2788, 1988, '/package-photos/Chinese Ensemble.jpg', true, 4),

('Signature Ensemble Set', '1.5 Hours

Refined trio on traditional Chinese instruments playing from a planned set list (no on-the-day requests).

Includes:
• Trio line up featuring dizi, guzheng and cello
• Customised set list based on your brief
• 2 - 3 sets totalling 90 minutes within a 3 hour window', 'chinese-ensemble', 4188, 2888, '/package-photos/Chinese Ensemble.jpg', true, 5);

-- Insert Emcee category services
INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order) VALUES
('Emcee 4hr', 'Includes:
• Complimentary 1 hour early arrival on AD
• 1 x Online consultation with the couple and planners
• Programme coordination and timekeeping
• Crowd engagement and guest guidance
• Liaison with DJ, live band and AV team
• Additional hours @$150/h', 'emcee', 1288, 888, '/package-photos/Wedding Emcee.jpg', true, 1);

-- Insert Emcee add-on (Additional hour)
INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order, is_addon, addon_price_per_unit) VALUES
('Emcee Additional Hour', 'Additional hour for emcee service', 'emcee', 150, 150, '/package-photos/Wedding Emcee.jpg', true, 2, true, 150);

-- Insert Stage Lighting category services
INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order) VALUES
('Atmosphere Lite', 'Simple stage wash and low fog to add gentle colour and ambience to your stage and march-ins.

Includes:
• 6x RGBWA PAR uprights
• 2x moving heads
• 1x low-fog machine
• Pre-programmed scenes
• 1x lighting engineer (4 hours)', 'stage-lighting', 1200, 820, '/package-photos/Stage Lighting.png', true, 1),

('Atmosphere Plus', 'Enhanced lighting with more fixtures, movement and totems for stronger beams, patterns and low-fog/haze effects that shape the whole room.

Includes:
• 8x RGBWA PAR uprights
• 4x moving heads
• 4x totem structures
• 1x low-fog or haze machine
• Pre-programmed scenes
• 1x lighting engineer (6 hours)', 'stage-lighting', 2900, 1880, '/package-photos/Stage Lighting.png', true, 2),

('Atmosphere Pro', 'Full show look with multiple moving heads, uprights and totems, plus fog/haze and rehearsal support for tightly cued, dramatic lighting across your programme.

Includes:
• 12x RGBWA PAR uprights
• 6x moving heads
• 6x totem structures
• 1x low-fog or haze machine
• Pre-programmed scenes
• Rehearsal Support
• 1x lighting engineer (8 hours)', 'stage-lighting', 4600, 2780, '/package-photos/Stage Lighting.png', true, 3),

('Lighting Engineer 4h a-la-carte', 'Professional lighting engineer for 4 hours', 'stage-lighting', 588, 388, '/package-photos/Stage Lighting.png', true, 4),

('Lighting Engineer Additional Hour', 'Additional hour for lighting engineer', 'stage-lighting', 88, 88, '/package-photos/Stage Lighting.png', true, 5);

-- Insert Photobooth category services
INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order) VALUES
('Classic Booth', 'Perfect for cocktails and pre-dinner moments.

A simple setup with instant prints and a full digital gallery for easy sharing.

Includes:
• Basic backdrop
• Unlimited prints for up to 2 hours
• Digital copies of all photos after event
• Wedding-themed props box', 'photobooth', 850, 588, '/package-photos/Photobooths.png', true, 1),

('Deluxe Booth', 'Designed for full reception coverage with higher throughput.

Upgraded backdrop, longer hours, more poses and prints.

Includes:
• Premium backdrop
• Unlimited prints for up to 4 hours
• Digital copies of all photos after event
• Wedding-themed props box
• Custom photo frame design', 'photobooth', 1650, 1088, '/package-photos/Photobooths.png', true, 2);

-- Insert Photobooth add-ons
INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order, is_addon, addon_price_per_unit) VALUES
('Photobooth Additional Hours', 'Additional hours for photobooth service', 'photobooth', 250, 250, '/package-photos/Photobooths.png', true, 3, true, 250),
('Photobooth AI Add-on', 'AI-powered photo enhancement and effects', 'photobooth', 100, 100, '/package-photos/Photobooths.png', true, 4, true, 100),
('Photobooth Polaroid Camera', 'Add a polaroid camera to your photobooth package', 'photobooth', 120, 120, '/package-photos/Photobooths.png', true, 5, true, 120);

-- Insert Photography category services
INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order) VALUES
('ROM Essential', '2 hours

Capture the key moments of your solemnisation with clean, natural photography delivered in a timely, fuss-free package.

Includes:
• 1x Photographer for 2 hours
• 80-120 Edited Photos
• 60 Days Private Online Storage
• Final photos in 30 days', 'photography', 900, 588, '/package-photos/Wedding Photography.jpg', true, 1),

('Essential Pre-Wedding Session', '1 Hour

A simple, quick pre-wedding portraits at one location.

Includes:
• 1x Photographer
• 50–60 edited photos
• 1x location
• 60 Days Private Online Storage
• 10–15 sneak peeks in 2 days
• Final photos in 30 days', 'photography', 558, 388, '/package-photos/Wedding Photography.jpg', true, 2),

('Signature Pre-Wedding Session', '2 Hours

More time and variety across up to two locations.

Includes:
• 1 photographer (2 hours)
• 100–120 edited photos
• Up to 2 locations (within 2 hours; transport charges apply)
• 60 Days Private Online Storage
• 10–15 sneak peeks in 2 days
• Final photos in 30 days', 'photography', 988, 688, '/package-photos/Wedding Photography.jpg', true, 3),

('Premium Pre-Wedding Session', '3 Hours

Extended coverage for more looks and storytelling.

Includes:
• 1 photographer (3 hours)
• 150 edited photos
• Up to 2 locations (within 3 hours; transport charges apply)
• 60 Days Private Online Storage
• 10–15 sneak peeks in 2 days
• Final photos in 30 days', 'photography', 1588, 988, '/package-photos/Wedding Photography.jpg', true, 4),

('Essential Day Coverage', '6 Hours

Perfect for morning highlights, solemnisation, and early banquet moments.

Includes:
• 1x Photographer
• 360 Edited Photos
• 60 Days Private Online Storage
• 10–15 sneak peeks in 2 days
• Final photos in 60 days', 'photography', 2488, 1688, '/package-photos/Wedding Photography.jpg', true, 5),

('Signature Day Coverage', '8 Hours

Extended coverage for full-day storytelling from preparations to dinner.

Includes:
• 1x Photographer
• 480 Edited Photos
• 60 Days Private Online Storage
• 10–15 sneak peeks in 2 days
• Final photos in 60 days', 'photography', 3288, 2188, '/package-photos/Wedding Photography.jpg', true, 6),

('Premium Day Coverage', '10 Hours

Comprehensive, all-day documentation from start to end with space for extra segments.

Includes:
• 1x Photographer
• 600 Edited Photos
• 60 Days Private Online Storage
• 10–15 sneak peeks in 2 days
• Final photos in 60 days', 'photography', 4088, 2588, '/package-photos/Wedding Photography.jpg', true, 7);

-- Insert Photography add-ons
INSERT INTO services (name, description, category, original_price, bows_price, image_url, is_active, display_order, is_addon, addon_price_per_unit) VALUES
('ROM Photography Additional Hours', 'Additional hours for ROM photography', 'photography', 250, 250, '/package-photos/Wedding Photography.jpg', true, 8, true, 250),
('Pre-Wedding Photography Additional Hours', 'Additional hours for pre-wedding photography', 'photography', 288, 288, '/package-photos/Wedding Photography.jpg', true, 9, true, 288),
('Actual Day Photography Additional Hours', 'Additional hours for actual day photography', 'photography', 288, 288, '/package-photos/Wedding Photography.jpg', true, 10, true, 288),
('Actual Day Photography Additional Photographer', 'Add an additional photographer for actual day coverage', 'photography', 158, 158, '/package-photos/Wedding Photography.jpg', true, 11, true, 158);
