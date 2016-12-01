var smafpages = [
	 { url: '/backoffice', templateUrl: '/partials/backoffice', controller: "SmafController"},
	 { url: '/affiliates', templateUrl: '/partials/affiliates', controller: "AffiliatesController"},
	 { url: '/affiliate/:id', templateUrl: '/partials/affiliate', controller: "AffiliateController"},
	 { url: '/orders', templateUrl: '/partials/orders', controller: "OrdersController" },
	 { url: '/order/:id', templateUrl: '/partials/order', controller: "OrderController" },
	 { url: '/raworder/:id', templateUrl: '/partials/raworder', controller: "DataController" },
	 { url: '/data/:type/:id', templateUrl: '/partials/data', controller: "DataController" },
	 { url: '/data/:type/:id/:backtype/:backid', templateUrl: '/partials/data', controller: "DataController" },
	 { url: '/testpay', templateUrl: '/partials/testpay', controller: "KartController"},
	 { url: '/links', templateUrl: '/partials/links', controller: "HomeController"}
];
