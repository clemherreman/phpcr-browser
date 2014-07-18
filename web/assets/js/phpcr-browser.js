require.config({
    paths: {
        'text' : '../bower_components/requirejs-text/text',
        'MainModule': 'app/Main/MainModule',
        'ApiModule': 'app/Api/ApiModule',
        'BrowserModule': 'app/Browser/BrowserModule',
        'GraphModule': 'app/Graph/GraphModule',
        'MenuModule': 'app/Menu/MenuModule',
        'TreeModule': 'app/Tree/TreeModule'
    },
    shim: {
    },
    modules: [
        {
            name: 'phpcr-browser',
            include: [
                'text',
                'MainModule',
                'ApiModule',
                'BrowserModule',
                'GraphModule',
                'MenuModule',
                'TreeModule'
            ],
            exclude: [
                'vendor'
            ]
        }
    ]
});
