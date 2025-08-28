# Server Banners

This directory contains banner images for automatic server appearance changes based on time of day.

## Directory Structure

```
banners/
├── day/           # Morning banners (6:30 AM)
├── afternoon/     # Evening banners (5:30 PM)  
├── night/         # Night banners (11:30 PM)
└── README.md
```

## Banner Requirements

- **Format**: JPG, PNG, or GIF
- **Size**: Recommended 960x540 pixels (16:9 aspect ratio)
- **File size**: Under 10MB for Discord compatibility

## Naming Convention

- Day: `cat_love.jpg`, `happy_couple.jpg`, `morning_coffee.jpg`
- Afternoon: `sunset_love.jpg`, `evening_walk.jpg`
- Night: `sleepy_couple.jpg`, `stars_romance.jpg`, `moonlight_love.jpg`

## How It Works

The bot automatically:
1. Changes server name and banner at scheduled times
2. Randomly selects from available banners in each category
3. Falls back gracefully if no banners are available
4. Applies different slowmode settings for day/night modes

## Adding New Banners

1. Place banner files in the appropriate directory
2. Restart the bot to load new banners
3. Banners are selected randomly from available files

## Schedule

- **6:30 AM**: Day mode (relaxed slowmode, day banners)
- **5:30 PM**: Afternoon mode (banner change only)  
- **11:30 PM**: Night mode (strict slowmode, night banners)