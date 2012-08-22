~function(){

	var async = async || {},
		initWithAttr = $('[data-toggle=async]');

	// 私有：异步组件的核心，传入 option，通过事件做指定的动作，并执行回调
	async._request = function(item, options){

		var url = options['url'],
			callback = options['callback'],
			data = options['data'],
			eventType = options['eventType'],
			method = options['method'].toLowerCase(),
			preventDefault = options['preventDefault'];
			
		data = typeof data === 'function' ? data() : data;

		item.on(eventType, function(e){
			// [默认] 阻止默认行为
			!preventDefault || e.preventDefault();
			
			// 没有 url 时返回一个错误仍然触发自定义事件
			if(!url) return async._error(item, callback);
			
			// 组件请求成功
			var handler = $[method](url, data, function(res){
				item.trigger('async_before');
				callback && callback.call(this, res);
				item.trigger('async_success', res);
				item.trigger('async_after', res);
			});
			
			// 出错时使用这个
			handler.error(function(){
				async._error(item, callback);
			});
		});
	};
	
	// 私有：默认 options
	async._defaultOptions = {
		data: {},
		eventType: 'click',
		method: 'get',
		preventDefault: 1
	};
	
	// 私有：触发 error，统一返回的 data 为空
	// 默认事件是不关错误与成功的，组件都应该为整个生命周期提供事件
	async._error = function(item, callback){
		item.trigger('async_before');
		callback && callback.call(null, '');
		item.trigger('async_error');
		item.trigger('async_after');
	};

	/* 以 js 方式调用 async 组件
	 * @param options {Object} 传入的对象，支持三个属性/方法
	 *  {
	 *     url: {String} [可选] 请求的地址，默认为 $(this).data('async')
	 *       也可以是在 selector 中使用 data-target="" 来指定 url
	 *     eventType: [可选] {String} 触发异步请求的事件，默认为 click
	 *     callback: [可选] {Function} 接入一个参数，当参数非空是为请求成功，否则为失败
	 *     data: {Object/Function} [可选] 需要发送的数据，当 data 为 Function 的时候，执行它
	 *     method: {String} [可选] 请求数据的式，GET / POST，默认为 GET
	 *     preventDefault: {Boolean} [可选] 异步请求一般都是不刷新页面的，所以默认会阻止默认事件，
	 *       设置为 false 让其不阻止事件，比如 form 配合 validator
	 *  }
	 */
	$.fn.async = function(options) {
		
		this.each(function(i, item){
			item = $(item);
						
			options['url'] = options['url'] || item.data('target');
			options['callback'] = options['callback'];
			options = $.extend(1, async._defaultOptions, options);
		
			async._request(item, options);
		})
	}
	
	// 如果是随 html attr 进来的，是不允许传数据的
	initWithAttr.length && initWithAttr.each(function(i, item){
		var options = $.extend(1, async._defaultOptions, {
				url: $(this).data('target')
			});
			
		async._request($(this), options);
	});

}(jQuery);