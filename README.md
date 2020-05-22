# Hostel Combine API

> Back-end API for HostelCombine application, which is a hostel directory website

## Version Info

- NodeJS v12.16.1

## Getting Started

- Rename "config/config.env.temp" to "config/config.env" and update the values; setting to your own.

> Install Dependencies

```
$ npm install
```

> Database Seeding

To seed the database with users, hostels, rooms and reviews with data from the "\_data" folder, run,

```
# Destroy all data
$ node seeder -d

# Import all data
$ node seeder -i
```

> Run application

```
# For production mode
$ npm run start

# For developer mode
$ npm run dev
```

## ✨Live Demo

The API is live at [herokuapp](https://node-hostel-combine-suh.herokuapp.com/).

Extensive documentation with examples [here](https://documenter.getpostman.com/view/8001436/Szt8c9Vt?version=latest)

- Version: 1.0.0
- License: MIT
- Author: Suhyeon Jang

## Resources

- [javascript regex url](https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url)
- [GeoJSON](https://mongoosejs.com/docs/geojson.html)
- [Express JS error handling](https://expressjs.com/en/guide/error-handling.html)
- [Express async handler](https://github.com/Abazhenov/express-async-handler)
- [Geocoder API npm](https://www.npmjs.com/package/node-geocoder)
- [MAPQUEST API KEY](https://developer.mapquest.com/)
- [centerSphere](https://docs.mongodb.com/manual/reference/operator/query/centerSphere/)
- [gt aggregation](https://docs.mongodb.com/manual/reference/operator/query/gt/index.html)
- [mongoose query](https://mongoosejs.com/docs/queries.html)
  - select, sort
- [aggregate](https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/)
- [sample image: pexels.com](https://www.pexels.com/)
- [BCrypt](https://www.npmjs.com/package/bcrypt)
- [JSON WebToken](https://www.npmjs.com/package/jsonwebtoken)
- [jwt.io](https://jwt.io/)
- [cookie-parser options](https://www.npmjs.com/package/cookie)
- [Nodemailer](https://nodemailer.com/)
- [fake mailbox](https://mailtrap.io/)
- [pre hook](https://mongoosejs.com/docs/api.html#schema_Schema-pre)
- [express route](https://expressjs.com/en/guide/routing.html)
- [express using middleware](https://expressjs.com/en/guide/using-middleware.html)
- [mongoose findByIdAndUpdate](https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndUpdate)
- [hacking nodejs and mongodb](https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html)
- [express mongo sanitize](https://www.npmjs.com/package/express-mongo-sanitize)
- [helmet](https://helmetjs.github.io/)
- [cross site scripting prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [mongoose index](https://mongoosejs.com/docs/2.7.x/docs/indexes.html)
- [CORS npm](https://www.npmjs.com/package/cors)
- [CORS docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
  - A web application executes a cross-origin HTTP request when it requests a resource that has a different origin (domain, protocol, or port) from its own.
- [docgen](https://github.com/thedevsaddam/docgen)
- [bootstrap fonts](https://github.com/twbs/bootstrap-sass/tree/master/assets/fonts/bootstrap)
