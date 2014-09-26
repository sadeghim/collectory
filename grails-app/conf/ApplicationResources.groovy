modules = {
    application {
        resource url:'js/application.js'
    }
    smoothness {
        resource url:'css/smoothness/jquery-ui-1.8.16.custom.css'
    }
    jquery_jsonp {
        resource url:'js/jquery.jsonp-2.1.4.min.js'
    }
    jquery_tools {
        resource url: 'js/jquery.tools.min.js'
    }
    jquery_json {
        resource url:'js/jquery.json-2.2.min.js'
    }
    jquery_i18n {
        resource url:'js/jquery.i18n.properties-1.0.9.min.js'
    }
    fancybox {
        resource url: 'js/jquery.fancybox/fancybox/jquery.fancybox-1.3.1.css'
        resource url: 'js/jquery.fancybox/fancybox/jquery.fancybox-1.3.1.pack.js'
    }
    jstree {
        resource url: 'js/jquery.jstree.js'
        resource url:[dir:'js/themes/classic', file:'style.css'], attrs:[media:'screen, projection, print']
    }
    jquery_ui_custom {
       resource url: 'js/jquery-ui-1.8.16.custom.min.js'
    }
    datadumper {
       resource url: 'js/datadumper.js'
    }
    bbq {
        resource url: 'js/jquery.ba-bbq.min.js'
    }
    openlayers {
        resource url: 'js/OpenLayers/OpenLayers.js'
        resource url: 'js/OpenLayers/theme/default/style.css'
    }
    map {
        resource url: 'js/map.js'
    }
    datasets {
        resource url:'js/datasets.js'
    }
    rotate {
        resource url:'js/jQueryRotateCompressed.2.1.js'
    }
    bigbuttons {
        resource url:'css/temp-style.css'
    }
    debug {
        resource url:'js/debug.js'
    }
    change {
        resource url:'js/change.js'
    }
    json2 {
        resource url:'js/json2.js'
    }
    fileupload {
        resource url:[dir:'js', file:'bootstrap-fileupload.min.js']
        resource url:[dir:'css', file:'bootstrap-fileupload.min.css']
    }
    collectory {
        dependsOn 'bootstrap,jquery,jquery_i18n,jquery_json,jquery_tools, jquery_jsonp'
        resource url:'js/collectory.js'
        resource url:'css/temp-style.css'
    }
    charts {
        resource url:'js/charts2.js'
        resource url:'js/charts.js'
    }
}
