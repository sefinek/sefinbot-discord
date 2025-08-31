const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');

const bannerPath = path.join(__dirname, '../../assets/banners');

const safeBannerRead = filePath => {
	try {
		if (existsSync(filePath)) return readFileSync(filePath);
		console.warn(`Banner » File not found: ${filePath}`);
		return null;
	} catch (err) {
		console.error(`Banner » Error reading ${filePath}:`, err.message);
		return null;
	}
};

const dayBanners = {
	catLoveYou: safeBannerRead(path.join(bannerPath, 'day/cat-love-you.gif')),
	catAndFish: safeBannerRead(path.join(bannerPath, 'day/cat_and_fish.jpg')),
	catPurple: safeBannerRead(path.join(bannerPath, 'day/cat_purple.jpg')),
	fallingSnowFox: safeBannerRead(path.join(bannerPath, 'day/falling-into-snow-fox.gif')),
	happySenko: safeBannerRead(path.join(bannerPath, 'day/happy-senko.gif')),
	senkoHearts: safeBannerRead(path.join(bannerPath, 'day/senko-hearts.gif')),
};

const afternoonBanners = {
	catAndFish: safeBannerRead(path.join(bannerPath, 'day/cat_and_fish.jpg')),
	catPurple: safeBannerRead(path.join(bannerPath, 'day/cat_purple.jpg')),
};

const nightBanners = {
	catBoat: safeBannerRead(path.join(bannerPath, 'night/cat_boat.jpg')),
	catCute: safeBannerRead(path.join(bannerPath, 'night/cat_cute.jpg')),
	girl: safeBannerRead(path.join(bannerPath, 'night/girl.gif')),
	senko: safeBannerRead(path.join(bannerPath, 'night/senko.gif')),
	sleepyFox1: safeBannerRead(path.join(bannerPath, 'night/sleepy-fox_1.gif')),
	sleepyFox2: safeBannerRead(path.join(bannerPath, 'night/sleepy-fox_2.gif')),
};

const specialBanners = {
	papiezowa: safeBannerRead(path.join(bannerPath, 'papiezowa.gif')),
};

const getRandomDayBanner = () => {
	const banners = Object.values(dayBanners).filter(banner => banner !== null);
	if (banners.length === 0) return null;
	return banners[Math.floor(Math.random() * banners.length)];
};

const getRandomAfternoonBanner = () => {
	const banners = Object.values(afternoonBanners).filter(banner => banner !== null);
	if (banners.length === 0) return null;
	return banners[Math.floor(Math.random() * banners.length)];
};

const getRandomNightBanner = () => {
	const banners = Object.values(nightBanners).filter(banner => banner !== null);
	if (banners.length === 0) return null;
	return banners[Math.floor(Math.random() * banners.length)];
};

module.exports = {
	...dayBanners,
	...afternoonBanners,
	...nightBanners,
	...specialBanners,
	getRandomDayBanner,
	getRandomAfternoonBanner,
	getRandomNightBanner,
	day1: dayBanners.catAndFish,
	day2: dayBanners.catPurple,
	rdNightBanner: getRandomNightBanner,
};