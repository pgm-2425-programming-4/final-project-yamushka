"use strict";

const strapi = require("@strapi/strapi");

async function createAdmin() {
  const app = await strapi().load();

  const existing = await strapi.query("admin::user").findOne({
    where: { email: "joanjode@student.arteveldehs.be" },
  });

  if (existing) {
    console.log("Admin user bestaat al.");
  } else {
    const role = await strapi.query("admin::role").findOne({
      where: { code: "strapi-super-admin" },
    });

    await strapi.query("admin::user").create({
      data: {
        firstname: "Jo",
        lastname: "Jo",
        email: "joanjode@student.arteveldehs.be",
        password: "Str0ngPass123!",
        roles: [role.id],
        isActive: true,
        blocked: false,
      },
    });

    console.log("Nieuwe admin is aangemaakt.");
  }

  process.exit(0);
}

createAdmin();
