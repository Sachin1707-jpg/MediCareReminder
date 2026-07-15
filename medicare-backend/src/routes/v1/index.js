const express = require('express');

// Import individual route files
const authRoute = require('./auth'); 
const medicineRoute = require('./medicine');
const dashboardRoute = require('./dashboard');
const analyticsRoute = require('./analytics');
const healthRoute = require('./health'); 
const remindersRoute = require('./reminders');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/medicines',
    route: medicineRoute,
  },
  {
    path: '/dashboard',
    route: dashboardRoute,
  },
  {
    path: '/analytics',
    route: analyticsRoute,
  },
  {
    path: '/health',
    route: healthRoute,
  },
  {
    path: '/reminders',
    route: remindersRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
