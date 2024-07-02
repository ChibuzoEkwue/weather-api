import axios from "axios";
import express from "express";

const app = express();

const port = process.env.PORT || 1000;

app.get("/", async (req, res) => {
	const { visitor_name } = req.query;
	try {
		const { data } = await axios(
			`https://api.geoapify.com/v1/ipinfo?apiKey=${process.env.API_KEY}`
		);
		const { city, location, ip } = data;

		const { data: weatherInfo } = await axios(
			`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${process.env.WEATHER_KEY}&units=metric`
		);

		res.json({
			client_ip: ip,
			location: city.name,
			greeting: `Hello, ${visitor_name || ""}! the temperature is ${
				weatherInfo.main.temp
			} Celcius in ${city.name}`,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: error.message || "Something went bad" });
	}
});

app.listen(port, () => {
	console.log("App is running");
});

export default app