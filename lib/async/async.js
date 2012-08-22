~function(){

	var async = async || {},
		initWithAttr = $('[data-async]');

	async._request = function(item, options){

		var url = options['url'],
			callback = options['callback'],
			data = options['data'],
			eventType = options['eventType'],
			method = options['method'].toLowerCase();

		item.on(eventType, function(){
			if(!url) return async._error(item, callback);
			
			var handler = $[method](url, data, function(res){
				item.trigger('async_before');
				callback && callback.call(this, res);
				item.trigger('async_success', res);
				item.trigger('async_after', res);
			});

			handler.error(function(){
				async._error(item, callback);
			});
		});
	};

	async._defaultOptions = {
		data: {},
		eventType: 'click',
		method: 'get'
	};
	
	async._error = function(item, callback){
		item.trigger('async_before');
		callback && callback.call(null, '');
		item.trigger('async_error');
		item.trigger('async_after');
	};

	// 如果是随 html attr 进来的，是不允许传数据的
	initWithAttr.length && initWithAttr.each(function(){
		var options = $.extend(1, async._defaultOptions, {
				url: $(this).data('async')
			});
			
		async._request($(this), options);
	})

	/* 以 js 方式调用 async 组件
	 * @param options {Object} 传入的对象，支持三个属性/方法
	 *  {
	 *     url: {String} [可选] 请求的地址，默认为 $(this).data('async')
	 *     eventType: [可选] {String} 触发异步请求的事件，默认为 click
	 *     callback: [可选] {Function} 接入一个参数，当参数非空是为请求成功，否则为失败
	 *     data: {Object/Function} [可选] 需要发送的数据，当 data 为 Function 的时候，执行它
	 *     method: {String} [可选] 请求数据的式，GET / POST，默认为 GET
	 *  }
	 */
	$.fn.async = function(options) {
		
		this.each(function(i, item){
			item = $(item);
			
			options['url'] = options['url'] || item.data('async');
			options['callback'] = options['callback'];
			options = $.extend(1, async._defaultOptions, options);
		
			async._request(item, options);
		})
	}

}(jQuery);