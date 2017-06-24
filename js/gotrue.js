(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _pagination=require("./pagination");function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}var API=function(){function API(apiURL){_classCallCheck(this,API);this.apiURL=apiURL}_createClass(API,[{key:"headers",value:function headers(){var _headers=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};return _extends({"Content-Type":"application/json"},_headers)}},{key:"parseJsonResponse",value:function parseJsonResponse(response){return response.json().then(function(json){if(!response.ok){return Promise.reject(json)}var pagination=(0,_pagination.getPagination)(response);return pagination?{pagination:pagination,items:json}:json})}},{key:"request",value:function request(path){var _this=this;var options=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var headers=this.headers(options.headers||{});return fetch(this.apiURL+path,_extends({},options,{headers:headers})).then(function(response){var contentType=response.headers.get("Content-Type");if(contentType&&contentType.match(/json/)){return _this.parseJsonResponse(response)}return response.text().then(function(data){if(!response.ok){return Promise.reject({data:data})}return{data:data}})})}}]);return API}();exports.default=API},{"./pagination":2}],2:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break}}catch(err){_d=true;_e=err}finally{try{if(!_n&&_i["return"])_i["return"]()}finally{if(_d)throw _e}}return _arr}return function(arr,i){if(Array.isArray(arr)){return arr}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i)}else{throw new TypeError("Invalid attempt to destructure non-iterable instance")}}}();exports.getPagination=getPagination;function getPagination(response){var links=response.headers.get("Link");var pagination={};if(links==null){return null}links=links.split(",");var total=response.headers.get("X-Total-Count");for(var i=0,len=links.length;i<len;i++){var link=links[i].replace(/(^\s*|\s*$)/,"");var _link$split=link.split(";");var _link$split2=_slicedToArray(_link$split,2);var url=_link$split2[0];var rel=_link$split2[1];var m=url.match(/page=(\d+)/);var page=m&&parseInt(m[1],10);if(rel.match(/last/)){pagination.last=page}else if(rel.match(/next/)){pagination.next=page}else if(rel.match(/prev/)){pagination.prev=page}else if(rel.match(/first/)){pagination.first=page}}pagination.last=Math.max(pagination.last||0,pagination.prev&&pagination.prev+1||0);pagination.current=pagination.next?pagination.next-1:pagination.last||1;pagination.total=total?parseInt(total,10):null;return pagination}},{}],3:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _microApiClient=require("micro-api-client");var _microApiClient2=_interopRequireDefault(_microApiClient);var _user=require("./user");var _user2=_interopRequireDefault(_user);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}var HTTPRegexp=/^http:\/\//;var GoTrue=function(){function GoTrue(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};_classCallCheck(this,GoTrue);if(!options.APIUrl){throw"You must specify an APIUrl of your GoTrue instance"}if(options.APIUrl.match(HTTPRegexp)){console.log("Warning:\n\nDO NOT USE HTTP IN PRODUCTION FOR GOTRUE EVER!\nGoTrue REQUIRES HTTPS to work securely.")}if(options.Audience){this.audience=options.Audience}this.api=new _microApiClient2.default(options.APIUrl)}_createClass(GoTrue,[{key:"request",value:function request(path,options){if(this.audience){options.headers=options.headers||{};headers["X-JWT-AUD"]=this.audience}return this.api.request(path,options)}},{key:"signup",value:function signup(email,password,data){return this.request("/signup",{method:"POST",body:JSON.stringify({email:email,password:password,data:data})})}},{key:"signupExternal",value:function signupExternal(provider,code,data){return this.request("/signup",{method:"POST",body:JSON.stringify({provider:provider,code:code,data:data})})}},{key:"login",value:function login(email,password,remember){var _this=this;return this.request("/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=password&username="+encodeURIComponent(email)+"&password="+encodeURIComponent(password)}).then(function(response){var user=new _user2.default(_this.api,response,_this.audience);user.persistSession(null);return user.reload()}).then(function(user){if(remember){user.persistSession(user)}return user})}},{key:"loginExternal",value:function loginExternal(provider,code,remember){var _this2=this;return this.request("/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=authorization_code&code="+code+"&provider="+provider}).then(function(response){var user=new _user2.default(_this2.api,response,_this2.audience);user.persistSession(null);return user.reload()}).then(function(user){if(remember){user.persistSession(user)}return user})}},{key:"confirm",value:function confirm(token){return this.verify("signup",token)}},{key:"requestPasswordRecovery",value:function requestPasswordRecovery(email){return this.request("/recover",{method:"POST",body:JSON.stringify({email:email})})}},{key:"recover",value:function recover(token){return this.verify("recovery",token)}},{key:"user",value:function user(tokenResponse){return new _user2.default(this.api,tokenResponse)}},{key:"currentUser",value:function currentUser(){return _user2.default.recoverSession()}},{key:"verify",value:function verify(type,token){var _this3=this;return this.request("/verify",{method:"POST",body:JSON.stringify({token:token,type:type})}).then(function(response){return new _user2.default(_this3.api,response).reload()})}}]);return GoTrue}();exports.default=GoTrue;if(typeof window!=="undefined"){window.GoTrue=GoTrue}},{"./user":4,"micro-api-client":1}],4:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _microApiClient=require("micro-api-client");var _microApiClient2=_interopRequireDefault(_microApiClient);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}var ExpiryMargin=60*1e3;var storageKey="gotrue.user";var currentUser=null;var User=function(){function User(api,tokenResponse,audience){_classCallCheck(this,User);this.api=api;this.processTokenResponse(tokenResponse);this.audience=audience}_createClass(User,[{key:"update",value:function update(attributes){var _this=this;return this.request("/user",{method:"PUT",body:JSON.stringify(attributes)}).then(function(response){for(var key in response){_this[key]=response[key]}return _this})}},{key:"jwt",value:function jwt(){var _this2=this;var _tokenDetails=this.tokenDetails(),jwt_expiry=_tokenDetails.jwt_expiry,refreshToken=_tokenDetails.refreshToken,jwt_token=_tokenDetails.jwt_token;if(jwt_expiry-ExpiryMargin<(new Date).getTime()){return this.request("/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=refresh_token&refresh_token="+refreshToken}).then(function(response){_this2.processTokenResponse(response);_this2.refreshPersistedSession(_this2);return _this2.jwt_token}).catch(function(error){console.error("failed to refresh token: %o",error);_this2.persistSession(null);_this2.jwt_expiry=_this2.refreshToken=_this2.jwt_token=null;return Promise.reject(error)})}return Promise.resolve(jwt_token)}},{key:"logout",value:function logout(){return this.request("/logout",{method:"POST"}).then(this.clearSession.bind(this)).catch(this.clearSession.bind(this))}},{key:"request",value:function request(path,options){var _this3=this;options=options||{};options.headers=options.headers||{};if(this.audience){options.headers["X-JWT-AUD"]=this.audience}return this.jwt().then(function(token){return _this3.api.request(path,_extends({headers:Object.assign(options.headers,{Authorization:"Bearer "+token})},options))})}},{key:"reload",value:function reload(){return this.request("/user").then(this.process.bind(this)).then(this.refreshPersistedSession.bind(this))}},{key:"process",value:function process(attributes){for(var key in attributes){if(key in User.prototype||key=="api"){continue}this[key]=attributes[key]}return this}},{key:"processTokenResponse",value:function processTokenResponse(tokenResponse){var now=new Date;this.tokenResponse=tokenResponse;this.refreshToken=tokenResponse.refresh_token;this.jwt_token=tokenResponse.access_token;now.setTime(now.getTime()+tokenResponse.expires_in*1e3);this.jwt_expiry=now.getTime()}},{key:"refreshPersistedSession",value:function refreshPersistedSession(user){currentUser=user;if(localStorage.getItem(storageKey)){this.persistSession(user)}return user}},{key:"persistSession",value:function persistSession(user){currentUser=user;if(user){localStorage.setItem(storageKey,JSON.stringify(user))}else{localStorage.removeItem(storageKey)}return user}},{key:"tokenDetails",value:function tokenDetails(){var fromStorage=localStorage.getItem(storageKey);if(fromStorage){return JSON.parse(fromStorage)}return{expires_in:this.expires_in,refreshToken:this.refreshToken,jwt_token:this.jwt_token}}},{key:"clearSession",value:function clearSession(){localStorage.removeItem(storageKey)}},{key:"user_list",value:function user_list(){return this.request("/admin/users",{method:"GET"})}}],[{key:"recoverSession",value:function recoverSession(){if(currentUser){return currentUser}var json=localStorage.getItem(storageKey);if(json){var data=JSON.parse(json);return new User(new _microApiClient2.default(data.api.apiURL),data.tokenResponse).process(data)}return null}}]);return User}();exports.default=User},{"micro-api-client":1}]},{},[3]);
