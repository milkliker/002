~function(){

	var _async = _async || {},
		initWithAttr = $('[data-async]');

	_async.request = function(item, options){

		var url = options['url'],
			callback = options['callback'],
			data = options['data'],
			eventType = options['eventType'],
			method = options['method'].toLowerCase();

		item.on(eventType, function(){
			if(!url) return callback(this, '');
			item.trigger('fetching');
			var handler = $[method](url, data, function(res){
				callback.call(this, res);
				item.trigger('done', res);
			})

			handler.error(function(){
				callback.call(this, '');
				item.trigger('error');
			})
		})
	}

	_async.defaultOptions = {
		callback: function(){},
		data: {},
		eventType: 'click',
		method: 'get'
	}


	// 如果是随 html attr 进来的，是不允许传数据的
	initWithAttr.length && initWithAttr.each(function(){
		var options = {
			url: $(this).data('async')
		}
		$.extend(_async.defaultOptions, options);

		_async.request($(this), _async.defaultOptions);
	})

	/* 以 js 方式调用 async 组件
	 * @param options {Object} 传入的对象，支持三个属性/方法
	 *  {
	 *     url: {String} 请求的地址
	 *     eventType: [可选] {String} 触发异步请求的事件，默认为 click
	 *     callback: [可选] {Function} 接入一个参数，当参数非空是为请求成功，否则为失败
	 *     data: {Object} [可选] 需要发送的数据
	 *     method: {String} [可选] 请求数据的式，GET / POST，默认为 GET
	 *  }
	 */
	$.fn.async = function(options) {
		if(!options) return;
		$.extend(_async.defaultOptions, options);

		this.each(function(){
			_async.request($(this), _async.defaultOptions);
		})
	}

}(jQuery);