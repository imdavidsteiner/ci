// TODO
// paypal integration
// initiateorder action on pay now

$(document).ready(function() {
// init angular
angular.bootstrap(document)
});

var smaf = angular.module('smaf', ['ngSanitize'])
	.config(
		[
		 '$routeProvider', function($routeProvider,$locationProvider) {
		 	// $locationProvider.html5Mode(true);
			 $routeProvider.
			 when('/home', { templateUrl: '/partials/home', controller: "HomeController"}).
			 when('/kart/ref/:respid/:suggestedFilterType', { templateUrl: '/partials/kart', controller: "KartController"}).
			 when('/kart/ref/:respid', { templateUrl: '/partials/kart', controller: "KartController"}).
			 when('/kart/:suggestedFilterType', { templateUrl: '/partials/kart', controller: "KartController"}).
			 when('/kart', { templateUrl: '/partials/kart', controller: "KartController"}).
			 when('/kart/failure', { templateUrl: '/partials/kart', controller: "KartController"}).
			 when('/kart/success', { templateUrl: '/partials/kart', controller: "KartController"}).
			 when('/ref/:respid', { templateUrl: '/partials/home', controller: "HomeController"}).
			 when('/oos', { templateUrl: '/partials/oos', controller: "HomeController"});
			 for(var i = 0; i < smafpages.length;i++) {
				 var rt = smafpages[i];
				 $routeProvider.when(rt.url, { templateUrl: rt.templateUrl, controller: rt.controller});
			 };
			 $routeProvider.otherwise({redirectTo: '/home'});
		 }
		]
		)
	.factory('Services', function($http) {
		var Services = {
		    getPromise: function(url) {
			      var promise = $http.get(url)
			    		.then(function (response) {
				        //console.log(response);
				        return response.data.response;
				  });
			      return promise;
			    },

		    postPromise: function(URL,data) {
			      var promise = $http({
						method: 'GET',
						url: URL+'?t='+data.request.action.datatype+'-'+data.request.action.type+'&json='+angular.toJson(data,true),
						data: ""
			      })
			    		.then(function (response) {
				        return response.data.response;
				  });
			      return promise;
			    }
		};

		Services.call = function(datatype, actiontype, selectedIds, inOnlyData, otherData) {
			var action = {
				"datatype":datatype,
				"type":actiontype,
				"selected":selectedIds,
				"in":inOnlyData
			};
			angular.extend(action,otherData);
			var request = { "request": { "action": action }};
			return Services.postPromise('/ws/call', request);
		};

	return Services;
});

function smafToBoolean(value) {
  if (value && value.length !== 0) {
    var v = smafLowercase("" + value);
    value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
  } else {
    value = false;
  }
  return value;
};
function smafSetCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString()) +
			"; domain=" + escape ('.sendmeafilter.com');
	document.cookie=c_name + "=" + c_value;
};
function smafGetCookie(cookiename) 
{
	var cookiestring=RegExp(""+cookiename+"[^;]+").exec(document.cookie);
	return unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
};
function smafNoCookie(c_name) { smafSetCookie(c_name,"",-1); }
function smafLowercase(string){return isString(string) ? string.toLowerCase() : string;};
function prefer(val,def) { return (val === undefined || val == null) ? def : val;};
function isArray(obj) {
	if (obj.constructor.toString().indexOf("Array") == -1)
		return false;
	else
		return true;
};

// Directives

/*
* Defines the ui-if tag. This removes/adds an element from the dom depending on a condition
* Originally created by @tigbro, for the @jquery-mobile-angular-adapter
* https://github.com/tigbro/jquery-mobile-angular-adapter
*/
/*
angular.module('smaf').directive('uiIf', [function () {
  return {
    transclude: 'element',
    priority: 1000,
    terminal: true,
    restrict: 'A',
    compile: function (element, attr, linker) {
      return function (scope, iterStartElement, attr) {
        iterStartElement[0].doNotMove = true;
        var expression = attr.uiIf;
        var lastElement;
        var lastScope;
        scope.$watch(expression, function (newValue) {
          if (lastElement) {
            lastElement.remove();
            lastElement = null;
          }
          if (lastScope) {
            lastScope.$destroy();
            lastScope = null;
          }
          if (newValue) {
            lastScope = scope.$new();
            linker(lastScope, function (clone) {
              lastElement = clone;
              iterStartElement.after(clone);
            });
          }
          // Note: need to be parent() as jquery cannot trigger events on comments
          // (angular creates a comment node when using transclusion, as data-ng-repeat does).
          iterStartElement.parent().trigger("$childrenChanged");
        });
      };
    }
  };
}]);
*/
//Controllers

function SmafController($scope, $rootScope, $location, Services) {
	$rootScope.g = smafstatus.gstatus;
	$rootScope.respid = if($routeParams.respid) smafSetCookie('smafid',$routeParams.respid,365);;
	$scope.ajax = function(datatype, actiontype, selectedIds, inOnlyData, otherData, after) { 
		Services.call(datatype, actiontype, selectedIds, inOnlyData, otherData)
		.then(function(data) {
			if(data.gstatus) { angular.copy(data.gstatus, $rootScope.g); };
			after(data);
		})
	};
	$scope.showShare = false;
	$scope.toggleShare = function() { $scope.showShare = !$scope.showShare; };
	$scope.appendDate = function() { return $rootScope.g.future ? (' - ' + $rootScope.g.now.substring(0,10)) : ''; };
	$scope.terms = false;
	$scope.privacy = false;
	$scope.aboutus = false;
	$scope.contactus = false;
	$scope.merv = false;
	$scope.carbon = false;
	$scope.hideAll = function() { $scope.terms = $scope.privacy = $scope.aboutus = $scope.contactus = false; $scope.merv = false; $scope.carbon = false; };
	$scope.toggle = function(type) { var s = $scope[type]; $scope.hideAll(); $scope[type] = ((s == true)?false:true); window.scroll(0,findPos(document.getElementById(type)));},
	$scope.actiontypes =
	{
	 	"memento": { id:"memento", name:"Memento", type:"Order", theclass:"action-normal", img:"document_yellow",
	 		formats: { order:"REPactor changed this order.", affiliate:"Order REPorder changed.", self:"REPactor changed order REPorder."  },
	 	},
	 	"ordercreated": { id:"ordercreated", name:"Order Created", type:"Order", theclass:"action-blocked", img:"add",
	 		formats: { order:"REPactor created this order.", affiliate:"Order REPorder created.", self:"REPactor created order REPorder."  },
	 	},
	 	"orderinitiated": { id:"orderinitiated", name:"Order Initiated", type:"Order", theclass:"action-normal", img:"traffic_lights_green",
	 		formats: { order:"REPactor initiated this order.", affiliate:"Order REPorder initiated.", self:"REPactor initiated order REPorder."  },
	 	},
	 	"paypalcheckout": { id:"paypalcheckout", name:"Paypal Checkout Initiated", type:"Order", theclass:"action-normal", img:"paypal",
	 		formats: { order:"PayPal start checkout.", affiliate:"PayPal start checkout for order REPorder.", self:"PayPal start checkout by REPactor for order REPorder." },
	 	},
	 	"paypalcheckoutdetails": { id:"paypalcheckoutdetails", name:"Paypal Checkout Details Retrieved", type:"Order", theclass:"action-normal", img:"paypal",
	 		formats: { order:"PayPal get checkout details.", affiliate:"PayPal get checkout details for order REPorder.", self:"PayPal get checkout details by REPactor for order REPorder." },
	 	},
	 	"paypalprofiledetails": { id:"paypalprofiledetails", name:"Paypal Get Profile Details Called", type:"Order", theclass:"action-normal", img:"paypal",
	 		formats: { order:"PayPal get profile details.", affiliate:"PayPal get profile details for order REPorder.", self:"PayPal get profile details by REPactor for order REPorder." },
	 	},
	 	"paypalinitialpayment": { id:"paypalinitialpayment", name:"Paypal Initial Payment Called", type:"Order", theclass:"action-normal", img:"paypal",
	 		formats: { order:"PayPal do initial payment.", affiliate:"PayPal do initial payment for order REPorder.", self:"PayPal do initial payment by REPactor for order REPorder." },
	 	},
	 	"paypalcreateprofile": { id:"paypalcreateprofile", name:"Paypal Create Profile Called", type:"Order", theclass:"action-normal", img:"paypal",
	 		formats: { order:"PayPal create payment profile.", affiliate:"PayPal create payment profile for order REPorder.", self:"PayPal create payment profile by REPactor for order REPorder." },
	 	},
	 	"paypalinitiated": { id:"paypalinitiated", name:"Paypal Initiated", type:"Order", theclass:"action-normal", img:"paypal",
	 		formats: { order:"REPactor entered PayPal for this order.", affiliate:"Order REPorder entered PayPal.", self:"REPactor entered PayPal for order REPorder." },
	 	},
	 	"paypalfailure": { id:"paypalfailure", name:"Paypal Failure", type:"Money", theclass:"action-error", img:"cross",
	 		formats: { order:"Paypal failure by REPactor.", affiliate:"Paypal failure for order REPorder.", self:"Paypal failure by REPactor for order REPorder." },
	 	},
	 	"ordershipped": { id:"ordershipped", name:"Order Shipped", type:"Order", theclass:"action-normal", img:"document_green",
	 		formats: { order:"REPactor shipped this order.", affiliate:"Order REPorder shipped.", self:"REPactor shipped order REPorder." },
	 	},
	 	"ordercancelled": { id:"ordercancelled", name:"Order Cancelled", type:"Order", theclass:"action-yellow", img:"document_black",
	 		formats: { order:"REPactor cancelled this order.", affiliate:"Order REPorder cancelled.", self:"REPactor cancelled order REPorder."  },
	 	},
	 	"orderpayment": { id:"orderpayment", name:"Payment", type:"Money", theclass:"action-normal", img:"money_dollar",
	 		formats: { order:"REPactor received payment for REPamount.", affiliate:"Received payment for order REPorder for REPamount.", self:"REPactor received payment for order REPorder for REPamount." },
	 	},
	 	"failedpayment": { id:"failedpayment", name:"Failed Payment", type:"Money", theclass:"action-error", img:"cross",
	 		formats: { order:"REPactor notified of failed payment for REPamount.", affiliate:"Notified of failed payment for order REPorder for REPamount.", self:"REPactor notified of failed payment for order REPorder for REPamount." },
	 	},
	 	"debited": { id:"debited", name:"Affiliate Debit", type:"Money", theclass:"action-green",  img:"money_dollar",
	 		formats: { order:"REPactor debited REPamount from REPnotify.", affiliate:"REPactor debited REPamount from REPnotify.", self:"REPactor debited REPamount from REPnotify." },
	 	},
	 	"credited": { id:"credited", name:"Affiliate Credit", type:"Money", theclass:"action-green", img:"money_dollar",
	 		formats: { order:"REPactor credited REPamount to REPnotify.", affiliate:"REPactor credited REPamount to REPnotify.", self:"REPactor credited REPamount to REPnotify." },
	 	},
	 	"paid": { id:"paid", name:"Affiliate Payment", type:"Money", theclass:"action-green", img:"money_dollar",
	 		formats: { order:"REPactor: paid REPamount to REPnotify.", affiliate:"REPactor: paid REPamount to REPnotify.", self:"REPactor: paid REPamount to REPnotify." },
	 	},
	 	"note": { id:"note", name:"Note", type:"Manual", theclass:"action-blue", img:"note",
	 		formats: { order:"REPactor: REPtitle.", affiliate:"REPorder: REPtitle.", self:"REPactor REPorder: REPtitle." },
	 	},
	 	"reminder": { id:"reminder", name:"Reminder", type:"Manual", theclass:"action-blue", img:"note",
	 		formats: { order:"From:REPactor To:REPnotify, REPtitle.", affiliate:"REPorder From:REPactor To:REPnotify, REPtitle.", self:"REPorder From:REPactor To:REPnotify, REPtitle." },
	 	},
	 	"error": { id:"error", name:"Error", type:"Manual", theclass:"action-error", img:"cancel",
	 		formats: { order:"REPactor Error: REPtitle", affiliate:"Error: REPtitle", self:"REPactor Error: REPtitle" },
	 	},
	};
	$scope.actionoptions = [_.values($scope.actiontypes)];

	$scope.usernames = {};
	$scope.getActionImage = function(action, size) { return size + '/' + $scope.actiontypes[action._atype].img; }
	$scope.getActionClass = function(action) { return size + '/' + $scope.actiontypes[action._atype].theClass; }
	$scope.createActionText = function(action, context) {
		var at = $scope.actiontypes[action._atype];
		var	msg = at.formats[context];
		msg = msg.replace(/REPactor/g,(action._aactor)?('<a href="/#/affiliate/'+action._aactor+'">'+$scope.usernames[action._aactor]+'</a>'):'NO ACTOR');
		msg = msg.replace(/REPamount/g,action.amount);
		var names = [];
		if(action.notify) {
			for(var i = 0; i < action.notify.length;i++)
				names.push('<a href="/#/affiliate/'+action.notify[i]+'">'+$scope.usernames[action.notify[i]]+'</a>');
		}
		else names = ['no one'];
		msg = msg.replace(/REPorder/g,(action._aorder)?('<a href="/#/order/'+action._aorder+'">'+action._aorder+'</a>'):'NO ORDER');
		msg = msg.replace(/REPnotify/g,names.join());
		msg = msg.replace(/REPtitle/g,action.title);
		msg = msg.replace(/REPtext/g,action.text);
		if(action.amount)
			msg = msg.replace(/REPamount/g,'$'+action.amount.toFixed(2));
		//msg = '<span>'+msg+'</span>';
		return msg;
	};
	$scope.startNewOrder = function() {
		if(confirm('Are you sure you want to start a new order?')){
			smafNoCookie('smaf');
			$location.path('/home').replace();
		}
	};
	$scope.gotoPath = function(path) { $location.path(path).replace(); }
	$scope.createNewOrder = function(path) {
		$scope.ajax('kart','startNewOrder',[], {} ,{}, function(data){
				$location.path('/home').replace();
			}
		)
	};
};

// HOME =============================================================================================

function HomeController($scope, $routeParams, $location, Services) {
	// HOME PAGE
	$scope.homepage = {
			order : function(filterType) {
				$location.path('/kart/'+filterType).replace();
			},
			longlasting : false,
			allergies : false,
			efficient : false,
			odors : false,
	};
	if($routeParams.respid) smafSetCookie('smafid',$routeParams.respid,365);
};

// KART =============================================================================================

function KartController($scope, $routeParams, $location, Services) {
	$scope.dataLoaded = false;
	if($routeParams.suggestedFilterType) $scope.suggestedFilterType = $routeParams.suggestedFilterType;
	$scope.order = {
		kart: {
			orderid:'Loading...',
			states: { orderState: 'newOrder' },
			frequency:0,
			starting:0,
			state:'UT',
			plan:'monthly',
			offerCode:'family',
			suggestedFilterType:'M8',
			suggestedFrequency:'0',
			agreeToAffiliateOffers:false,
			agreeToSpecialOffers:true,
			filterSelections: [{"id":'none',"name":'loading data'}],
			addItemForm: {
				qty:1,
				height:15,
				width:20,
				thickness:1,
				type:null,
				customQty:1,
				customDescription:"",
				customAmount:0,
				customCost:0
			},
			lineItems:[],
		},
	};
	$scope.order.kart.filterSelection = $scope.order.kart.filterSelections[0],
	$scope.successPage = $location.path().indexOf('/success') !== -1;
	$scope.failurePage = $location.path().indexOf('/failure') !== -1;
	$scope.kartPage = $location.path().indexOf('/kart') !== -1;
	$scope.orderPage = $location.path().indexOf('/order/') !== -1;
	$scope.showManual = false;
	$scope.showTerms = false;
	$scope.publicSite = true;
	$scope.showPrivacyDataFields = false;
	$scope.afterFilterSelections = function(data){
		$scope.order.kart.filterSelections = data.results.selections;
		var type = $scope.order.kart.suggestedFilterType = prefer($scope.order.kart.suggestedFilterType,'M8');
		$scope.order.kart.frequency = (($scope.order.kart.frequency == 0) ? $scope.order.kart.suggestedFrequency : $scope.order.kart.frequency);
		$scope.order.kart.addItemForm.qty = 1;
		if($scope.order.kart.filterSelections.length > 0) {
			for(var i = $scope.order.kart.filterSelections.length - 1;i >= 0;i--) {
				var sel = $scope.order.kart.filterSelections[i];
				var id = sel.id;
				sel.name = sel.text + ' $' + sel.price
				if(id.indexOf(type) == 0) {
					$scope.order.kart.addItemForm.type = sel;
				}
			};
		};

	};
	$scope.updateFilterSelections = function () {
		$scope.ajax('filter', 'selections', null, null, {
			height:$scope.order.kart.addItemForm.height,
			width:$scope.order.kart.addItemForm.width,
			thickness:$scope.order.kart.addItemForm.thickness},
			$scope.afterFilterSelections);
	};
	$scope.updateScreen = function(data)  {
		angular.copy(data.results.kart, $scope.order.kart); //$scope.order.kart = data.results.kart;
		$scope.publicSite = $scope.order.kart.public;
		$scope.showPrivacyDataFields = $scope.showManual && !$scope.publicSite;
		if($scope.order.kart.states.orderState == 'newOrder') {
			if(data.action.id = 'recalc') { $scope.order.kart.addItemForm.qty = 1; }
			if($scope.suggestedFilterType) {
				$scope.order.kart.suggestedFilterType = $scope.suggestedFilterType;
				$scope.order.kart.suggestedFrequency = $scope.suggestedFilterType == 'C' ? 1 : ($scope.suggestedFilterType == 'F8' ? 6 : 3);
			}
			$scope.updateFilterSelections();
		};
		$scope.dataLoaded = true;
	};
	$scope.call = function (type) {
		$scope.ajax('kart', type, null, { kart: $scope.order.kart}, {}, $scope.updateScreen);
	};
	$scope.finishPayPalOrder = function () {
		$scope.ajax('kart', 'finishPayPal', null, {}, {}, function(data) {
			if(data.results.failed) { window.location = data.results.failed.redirect; }
			else { $scope.updateScreen(data); }
		});
	};
	$scope.recalc = function() { $scope.call('recalc'); };
	$scope.get = function() { $scope.call('get'); };
	$scope.add = function() { $scope.call('add'); };
	$scope.customAdd = function() { $scope.call('customAdd'); };
	$scope.putOffer = function(code) { $scope.order.kart.offerCode = code; };
	$scope.validateOffer = function() { $scope.call('validateOffer'); };
	$scope.startNewOrder = function() {
		if(confirm('Are you sure you want to start a new order?')){
			$scope.call('startNewOrder');
			$location.path('/home').replace();
		}
	};
	$scope.removeItem = function (idToRemove) {
		$scope.ajax('kart', 'removeItem', [idToRemove], {}, {}, $scope.updateScreen);
	};
	$scope.toggleManual = function() { $scope.showManual = ($scope.showManual?false:true); $scope.showPrivacyDataFields = $scope.showManual && !$scope.publicSite;};
	$scope.toggleTerms = function() { $scope.showPrivacy = false; $scope.showTerms = ($scope.showTerms?false:true); };
	$scope.togglePrivacy = function() { $scope.showTerms = false; $scope.showPrivacy = ($scope.showPrivacy?false:true); };
	$scope.paypalsuccess = function() { $location.path('kart/success').replace(); };
	$scope.paypalfailure = function() { $location.path('kart/failure').replace(); };
	$scope.gotoKartPage = function() { $location.path('kart').replace(); };
	$scope.gotoOrderPage = function() { $location.path('order/'+$scope.order.kart.orderid).replace(); };
	$scope.canComplete = function(doIt) { 
		var msg = 'Before checkout you still need to do the following:\n'
		var doAlert = false;
		if($scope.order.kart.states.validOrder == false) {
			msg = msg + ' - You must select and add items to your order.\n';
			doAlert = true;
		}
		if(!$scope.order.kart.agreeToTerms){
			msg = msg + ' - You must agree to the terms and conditions.\n';
			doAlert = true;
		}
		if(doAlert) { alert(msg + 'See the items highlighted in orange.') }
		else doIt();
	};
	$scope.addHighlighted = function() { return (!$scope.order.kart.states.validOrder ? 'orange' : ''); };
	$scope.agreeHighlighted = function() { return (!$scope.order.kart.agreeToTerms ? 'orange' : ''); };
	$scope.startPaypal = function() {
		$scope.canComplete(function(){
			//alert('Paypal is currently unavailable for completing your order.');
			$scope.ajax('kart', 'startPayPal', null, { kart: $scope.order.kart }, {}, function(data) {
				if(data.results.success) { window.location = data.results.success.redirect; }
				else alert('PayPal service is currently unavailable. Try again later.');
			});
		});
	};
	$scope.payNow = function() {
		$scope.canComplete(function(){
			$scope.call('initiate');
			//$location.path('order/'+$scope.order.kart.orderid).replace();
		});
	};
	if($scope.successPage) $scope.finishPayPalOrder(); else $scope.get();
	$scope.readOnly = true;
	if($routeParams.respid) smafSetCookie('smafid',$routeParams.respid,365);
};

// DATA =============================================================================================

function DataController($scope, $routeParams, $location, Services) {
	$scope.type = $routeParams.type;
	$scope.id = $routeParams.id;
	$scope.backtype = $routeParams.backtype;
	$scope.backid = $routeParams.backid;
	$scope.config = {
			raworder: 	{ title:"Order With Actions", back:"/order/"+$scope.id, deleteback:"/orders" },
			order: 		{ title:"Order", back:"/order/"+$scope.id, deleteback:"/orders" },
			affiliate: 	{ title:"Affiliate", back:"/affiliate/"+$scope.id, deleteback:"/affiliates"  },
			action:	 	{ title:"Action", back:"/"+$scope.backtype+"/"+$scope.backid, deleteback:"/"+$scope.backtype+"/"+$scope.backid },
		};
	$scope.data = {};
	$scope.title = $scope.config[$scope.type].title;
	$scope.backto = $scope.config[$scope.type].back;
	$scope.deletebackto = $scope.config[$scope.type].deleteback;
	$scope.back = function() { $location.path($scope.backto).replace();  };
	$scope.deleteBack = function() { $location.path($scope.deletebackto).replace();  };
	$scope.extraQuery = { idtype:$scope.backtype, otherid:$scope.backid };
	$scope.save = function() {
		try {
			$scope.data = angular.fromJson($('#jsondata').val());
			var data = {};
			data[$scope.type] = $scope.data;
			$scope.ajax($scope.type,'save',[$scope.id], data, {}, function(data) {} );
			$scope.back();
		} catch(e) { alert('Data Error:\n' + e)}
	};
	$scope.deleteData = function() {
		if(confirm('Are you sure you want to delete this?')) {
			try {
				$scope.data = angular.fromJson($('#jsondata').val());
				$scope.ajax($scope.type,'delete',[$scope.id], {},{}, function(data){$scope.deleteBack();});
			} catch(e) { alert('Data Error:\n' + e)};
		}
	};
	$scope.ajax($scope.type,'get',[$scope.id],{},$scope.extraQuery, function(data){
		if($scope.type == 'order' || $scope.type == 'raworder') { angular.copy(data.results.order, $scope.data) }
		else angular.copy(data.results.data, $scope.data);
	});
};

// ORDER LIST =============================================================================================

function OrdersController($scope, $routeParams, $location, $http, Services, $rootScope, $compile) {
	$scope.list = {
		views: 	[
		          	{"id":'all',"name":'all'},
		          	{"id":'needship',"name":'need to ship'},
		          	{"id":'waitingpayment',"name":'waiting for payment'},
		          	{"id":'waitingtime',"name":'waiting for time'},
		          	{"id":'backordered',"name":'backordered'},
		        ],
		dateFilters: 	[
				          	{"id":'today',"name":'today'},
				          	{"id":'week',"name":'this week'},
				          	{"id":'month',"name":'this month'},
				          	{"id":'ytd',"name":'ytd'},
				          	{"id":'all',"name":'all'},
				        ],
		actions: [
		          	{"id":'none',"name":'(select action)'},
		          	{"id":'selectall',"name":'select all'},
		          	{"id":'deselectall',"name":'deselect all'},
		          	{"id":'labels',"name":'export labels'},
		          	{"id":'ship',"name":'mark as shipped'},
		          	{"id":'backorder',"name":'mark as backordered'},
		          	{"id":'cancel',"name":'cancel'},
		          	{"id":'delete',"name":'permanently delete'},
		         ],
		items: [],
		setSelectAll: function(value) {
			var len = $scope.list.items.length;
			for(var i = 0; i < len;i++) {
				$scope.list.items[i].selected = value;
			};
		},
		setSelected: function() {
			// Make list of selected order ids
			var len = $scope.list.items.length;
			var selected = [];
			for(var i = 0; i < len;i++) {
				if($scope.list.items[i].selected) {
					selected.push($scope.list.items[i].orderid)
				}
			};
			$scope.list.action.selected = selected;
		},
		get: function() {
			$scope.list.action.action = $scope.list.actions[0];
			$scope.list.call();
		},
		call: function() {
			$scope.list.setSelected();
			$scope.ajax('order', 'list', null, null, $scope.list.action, function(data){
				$scope.list.items = data.results.listitems;
			})
		},
		refresh: function() { $scope.list.get(); },
		act: function() {
			if($scope.list.action.action.id == 'selectall') { $scope.list.setSelectAll(true); }
			else if($scope.list.action.action.id == 'deselectall') { $scope.list.setSelectAll(false); }
			else {
				$scope.list.setSelected();
				if($scope.list.action.selected.length < 1) {
					alert('No orders are selected. Please select orders and try again.')
				}
				else if(confirm('Are you sure you want to: '+ $scope.list.action.action.name +'?\nNumber of selected orders: '+$scope.list.action.selected.length)) {
					$scope.list.call();
					$scope.list.action.action = $scope.list.actions[0];
				}
			};
		},
		edit: function(id) {
			//alert('edit: '+id);
			$location.path('order/'+id).replace();
		},
	};
	$scope.list.action = {
		selected: [],
		page: 1,
		pageSize: 50,
		keywords: '',
		view: $scope.list.views[0],
		dateFilter: $scope.list.dateFilters[1],
		action: $scope.list.actions[0],
	},
	$scope.list.orderId = $routeParams.orderId;
	$scope.list.get();
};

// ORDER =============================================================================================

function OrderController($scope, $routeParams, $location, $http, Services, $rootScope, $compile) {
	$scope.dataLoaded = false;
	$scope.id = $routeParams.id;
	$scope.orderPage = true;
	$scope.actions = [];
	$scope.order = {};
	$scope.publicSite = false;
	$scope.showManual = true;
	$scope.showPrivacyDataFields = false;
	$scope.showPaymentWindow = false;
	$scope.showShipWindow = false;
	$scope.additionalData = {};
	$scope.toggleShipBox = function() { $scope.showShipWindow = !$scope.showShipWindow; };
	$scope.togglePaymentBox = function() { $scope.showPaymentWindow = !$scope.showPaymentWindow; };
	$scope.putDefaultPaymentAmount = function() { 
		$scope.order.payment = {}; 
		if($scope.order.kart.states.initialPaymentDone) $scope.putPeriodicPaymentAmount();
		else $scope.putInitialPaymentAmount();
	};
	$scope.putInitialPaymentAmount = function() { $scope.order.payment = {}; $scope.order.payment.amount = $scope.order.initialPaymentData._total; $scope.order.payment.taxAmount = $scope.order.initialPaymentData._taxAmount; $scope.order.payment.type = 'initial'; };
	$scope.putPeriodicPaymentAmount = function() { $scope.order.payment = {}; $scope.order.payment.amount = $scope.order.recurringPaymentData._total;  $scope.order.payment.taxAmount = $scope.order.recurringPaymentData._taxAmount;  $scope.order.payment.type = 'periodic'; };
	$scope.saveAndShip = function() { 
		alert('Marked as Shipped.');
		$scope.toggleShipBox();
		//$scope.order.action = 'payment';
		//$scope.call('payment', function(){ $scope.togglePaymentBox(); $scope.putDefaultPaymentAmount(); });
	};
	$scope.saveAndMakePayment = function() { 
		$scope.order.action = 'payment';
		$scope.call('payment', function(){ $scope.togglePaymentBox(); $scope.putDefaultPaymentAmount(); });
	};
	$scope.call = function(action,after) {
		$scope.ajax('order',action,
			[$scope.id], { order: $scope.order } , $scope.additionalData, function(data){
			angular.copy(data.results.order, $scope.order);
			$scope.showPrivacyDataFields = $scope.showManual && !$scope.publicSite;
			$scope.ajax('action','list',[],{},{ order: $scope.id }, function(data){
				angular.copy(data.results.actions, $scope.actions);
				angular.copy(data.results.users, $scope.usernames);
				$scope.dataLoaded = true;
				after();
			})
		});
	};
	$scope.dosave = function(after) { $scope.call('save',after);	};
	$scope.gotoParamPath = function(prepath) { $location.path(prepath + $scope.order.selected[1]).replace(); };
	$scope.gotoList = function() { $location.path('/orders').replace(); };
	$scope.saveThenList = function() { $scope.dosave(function(){ $location.path('/orders').replace(); }) };
	$scope.saveThenData = function() { $scope.dosave(function(){ $location.path('/data/order/' + $scope.id).replace(); }); };
	$scope.saveThenRaw = function() { $scope.dosave(function(){ $location.path('/data/raworder/' + $scope.id).replace(); }); };
	$scope.saveThenNewOrder = function() { alert('saveThenNewOrder(): MMB')};
	$scope.saveThenKart = function() { alert('saveThenKart(): MMB')};
	$scope.editAction = function(aid) { $scope.dosave(function(){ $location.path('/data/action/'+aid+'/order/' + $scope.id).replace(); }); };
	$scope.viewActionToggle = function(aid) { 
		for(var i = $scope.actions.length - 1;i >= 0;i--) 
			if($scope.actions[i]._aid == aid) 
				if($scope.actions[i].show) 
					$scope.actions[i].show = false;
				else
					$scope.actions[i].show = true;
		};
	$scope.viewOrderToggle = function() { 
		if($scope.order.showdata) 
			$scope.order.showdata = false;
		else
			$scope.order.showdata = true;
		};
	$scope.addAction = function() {
		$scope.dosave(function(){ $location.path('/data/action/add/order/'+$scope.id).replace(); });
	};
	$scope.call('get',function(){ $scope.putDefaultPaymentAmount(); });
	
};

// AFFILIATE LIST ======================================================================================

function AffiliatesController($scope, $routeParams, $location, Services) {
	$scope.views = [
      	{"id":'all',"name":'all'},
      	{"id":'needpayment',"name":'need to pay'},
    ];
    $scope.actions = [
      	{"id":'none',"name":'(select action)'},
      	{"id":'selectall',"name":'select all'},
      	{"id":'deselectall',"name":'deselect all'},
      	{"id":'labels',"name":'export mail data'},
      	{"id":'pay',"name":'mark as payed'},
      	{"id":'delete',"name":'permanently delete'},
     ],
 	$scope.action = {
    			selected: [],
    			page: 1,
    			pageSize: 50,
    			keywords: '',
    			view: $scope.views[0],
    			action: $scope.actions[0],
    		};
    $scope.items = [];
	$scope.setSelectAll = function(value) {
		var len = $scope.items.length;
		for(var i = 0; i < len;i++) {
			$scope.items[i].selected = value;
		};
	};
	$scope.setSelected = function() {
		var len = $scope.items.length;
		var selected = [];
		for(var i = 0; i < len;i++) {
			if($scope.items[i].selected) {
				selected.push($scope.items[i].username)
			}
		};
		$scope.action.selected = selected;
	};
	$scope.call = function() {
		$scope.setSelected();
		$scope.ajax('affiliate', 'list', null, null, $scope.action, function(data){
			$scope.items = data.results.affiliates;
		});
	};
	$scope.get = function() {
		$scope.action.action = $scope.actions[0];
		$scope.call();
	};
	$scope.refresh = function() { $scope.get(); };
	$scope.act = function() {
		if($scope.action.action.id == 'selectall') { $scope.setSelectAll(true); }
		else if($scope.action.action.id == 'deselectall') { $scope.setSelectAll(false); }
		else {
			$scope.setSelected();
			if($scope.action.selected.length < 1) {
				alert('No affiliates are selected. Please select affiliates and try again.')
			}
			else if(confirm('Are you sure you want to: '+ $scope.action.action.name +'?\nNumber of selected affiliates: '+$scope.action.selected.length)) {
				$scope.call();
				$scope.action.action = $scope.actions[0];
			}
		};
	};
	$scope.edit = function(id) {
		//alert('edit: '+id);
		$location.path('affiliate/' + id).replace();
	};
	$scope.get();
};

// AFFILIATE===========================================================================================

function AffiliateController($scope, $routeParams, $location, $http, Services, $rootScope, $compile) {
	$scope.dataLoaded = false;
	$scope.id = $routeParams.id;
	$scope.afilliate = { "username": $routeParams.id, "user":"loading", "active":true};
	$scope.action = 'get';
	$scope.affiliate = {};
	$scope.actions = [];
	$scope.actionPage = 1;
	$scope.actiontype = 'all';
	$scope.call = function(after) {
		$scope.ajax('affiliate', $scope.action, [$scope.id], {"affiliate":$scope.affiliate}, {}, function(data){
				angular.copy(data.results.data, $scope.affiliate);
				$scope.ajax('action','list',[],{},{ affiliate: $scope.id }, function(data){
					angular.copy(data.results.actions, $scope.actions);
					angular.copy(data.results.users, $scope.usernames);
					$scope.dataLoaded = true;
					after();
				})
			})
	};
	$scope.dosave = function(after) {
		$scope.action = 'save';
		$scope.call(after);
	};
	$scope.back = function() { $location.path('/affiliates').replace(); };
	$scope.list = function() { $scope.dosave(function(){ $location.path('/affiliates').replace(); }) };
	$scope.data = function() { $scope.dosave(function(){ $location.path('/data/affiliate/' + $scope.affiliate.username).replace(); }); };
	$scope.add = function() { alert('add(): MMB')};
	$scope.editAction = function(aid) { $scope.dosave(function(){ $location.path('/data/action/'+aid+'/affiliate/' + $scope.id).replace(); }); };
	$scope.addAction = function() {
		$scope.dosave(function(){ $location.path('/data/action/add/affiliate/'+$scope.id).replace(); });
	};
	$scope.call(function(){});
};


