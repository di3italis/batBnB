'use strict';

const bcrypt = require("bcryptjs");
const { User, Spot, Booking, Review, Image } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Seed Users
        const users = await User.bulkCreate(
            [
                {
                    firstName: "Usario",
                    lastName: "Democaratico",
                    email: "demo@user.io",
                    username: "Demo-lition",
                    hashedPassword: bcrypt.hashSync("password"),
                },
                {
                    firstName: "John",
                    lastName: "Doe",
                    email: "john@doe.com",
                    username: "john_doe",
                    hashedPassword: bcrypt.hashSync("password"),
                },
            ],
            { validate: true }
        );

        // Seed Spots
        // const firstUser = await User.findOne({ order: [["createdAt", "ASC"]] });
        // if (firstUser) {
        await Spot.bulkCreate([
            {
                ownerId: 1,
                address: "580 Brickyard Road",
                city:  "Big Sur",
                state: "California",
                country: "USA",
                lat: 37.7645358,
                lng: -122.4730327,
                name: "Enchanted Forest Blacksmith's Retreat",
                description: "Nestled among the whispering pines on the cliff's edge, our enchanting cabin was made by Samuel's grandfather, who was a blacksmith. It is a marvel of organic industrial architecture, offering a one-of-a-kind stay. Crafted from nature's blueprint, the pod blends stone and aged metal to create an atmosphere of rustic luxury. Inside, find custom-designed furniture that echoes the curves of the forest, while round windows frame panoramic views of the mystical landscape. This cliffside retreat offers modern amenities without sacrificing its fairy-tale charm. Perfect for romantic getaways or solitary escapes, let the Egg Pod be your nest in the clouds.",
                price: 123,
            },
            {
                ownerId: 2,
                address: "321 Vito Place",
                city: "Paris",
                state: "Texas",
                country: "United States of America",
                lat: 33.6609,
                lng: -95.5555,
                name: "Whispering Ruins Manor: A Baroque Haven",
                description: "Immerse yourself in the grandeur of bygone eras at the Whispering Ruins Manor. This once-majestic baroque estate, now gracefully reclaimed by nature, offers a nocturnal retreat like no other. The intricate architecture, now with an air of mystique from its partial ruins, provides the perfect backdrop for our echolocation-friendly design. High ceilings, open spaces, and naturally textured surfaces ensure a sensational stay for our esteemed winged guests. With windows that open to the dense forest, enjoy the twilight like nobility of old.",
                price: 999,
            },
        ]);
        // }

        // Seed Bookings
        await Booking.bulkCreate([
            {
                spotId: 1,
                userId: 2,
                startDate: "2023-11-19",
                endDate: "2023-11-20",
            },
            {
                spotId: 2,
                userId: 1,
                startDate: "2023-11-19",
                endDate: "2024-11-20",
            },
        ]);

        // Seed Reviews
        await Review.bulkCreate([
            {
                userId: 1,
                spotId: 2,
                review: "I've never felt more at home away from my cave! The open design is perfect for practicing my flight patterns, and the natural acoustics are just incredible for echolocation. There's something special about the blend of ancient architecture and forest that makes the manor irresistibly charming. Will be my go-to retreat spot!",
                stars: 3,
            },
            {
                userId: 2,
                spotId: 1,
                review: "Just magical! Waking up to the sunrise through those incredible round windows was like living in a dream. The craftsmanship is out of this world, and the attention to detail in the interior design complements the exterior's wild beauty. It was cozy, clean, and everything I hoped for a weekend escape. The forest whispers at night are an added lullaby. Highly recommend!",
                stars: 2,
            },
        ]);

        // Seed Images
        await Image.bulkCreate([
            {
                imageableType: "Spot",
                imageableId: 1,
                url: "https://batbnb.s3.us-west-1.amazonaws.com/1/1-front.png",
                preview: true,
            },
            {
                imageableType: "Spot",
                imageableId: 1,
                url: "https://batbnb.s3.us-west-1.amazonaws.com/1/1-beds.png",
                preview: false,
            },
            {
                imageableType: "Spot",
                imageableId: 1,
                url: "https://batbnb.s3.us-west-1.amazonaws.com/1/1-lounge.png",
                preview: false,
            },
            {
                imageableType: "Spot",
                imageableId: 1,
                url: "https://batbnb.s3.us-west-1.amazonaws.com/1/1-patio.png",
                preview: false,
            },
            {
                imageableType: "Spot",
                imageableId: 1,
                url: "https://batbnb.s3.us-west-1.amazonaws.com/1/1-kidscottage.png",
                preview: false,
            },
            {
                imageableType: "Spot",
                imageableId: 2,
                url: "https://batbnb.s3.us-west-1.amazonaws.com/destroyedPallace/dP2.png",
                preview: true,
            },
            {
                imageableType: "Spot",
                imageableId: 2,
                url: "https://batbnb.s3.us-west-1.amazonaws.com/destroyedPallace/dP3.png",
                preview: false,
            },
            { imageableType: "Spot",
                imageableId: 2,
                url: "https://batbnb.s3.us-west-1.amazonaws.com/destroyedPallace/dP4.png",
                preview: false,
            },
            { imageableType: "Spot",
                imageableId: 2,
                url: "https://batbnb.s3.us-west-1.amazonaws.com/destroyedPallace/dP5.png",
                preview: false,
            },
            { imageableType: "Spot",
                imageableId: 2,
                url: "https://batbnb.s3.us-west-1.amazonaws.com/destroyedPallace/dP7.png",
                preview: false,
            },
            {
                imageableType: "Review",
                imageableId: 1,
                url: "https://airBarnBats.com/Review1.jpg",
                preview: true,
            },
            {
                imageableType: "Review",
                imageableId: 2,
                url: "https://airBarnBats.com/Review1.jpg",
                preview: true,
            },
            {
                imageableType: "User",
                imageableId: 1,
                url: "https://airBarnBats.com/User1.jpg",
                preview: true,
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await User.destroy({ where: {} });
        await Spot.destroy({ where: {} });
        await Booking.destroy({ where: {} });
        await Review.destroy({ where: {} });
        await Image.destroy({ where: {} });
    },
};
