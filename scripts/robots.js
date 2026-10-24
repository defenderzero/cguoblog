hexo.extend.generator.register('robots', function () {
  var url = (hexo.config.url || '').replace(/\/+$/, '');
  var lines = [
    'User-agent: *',
    'Allow: /',
    '',
    'Sitemap: ' + url + '/sitemap.xml'
  ];

  return {
    path: 'robots.txt',
    data: lines.join('\n')
  };
});
