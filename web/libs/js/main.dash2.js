$.ccio={fr:$('#files_recent'),mon:{}};
    
    $.ccio.gid=function(x){
        if(!x){x=10};var t = "";var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < x; i++ )
            t += p.charAt(Math.floor(Math.random() * p.length));
        return t;
    };
    $.ccio.init=function(x,d,z,k){
        if(!k){k={}};k.tmp='';
        switch(x){
            case'getLocation':
                var l = document.createElement("a");
                l.href = d;
                return l;
            break;
            case'ArrayBuffertoB64':
                var reader = new FileReader();
                reader.addEventListener("loadend",function(d){return z(reader.result)});
                reader.readAsDataURL(new Blob([d], {                     
                    type: "image/jpeg"
                }));
            break;
            case 'ls'://livestamp all
                g={e:jQuery('.livestamp')};
                g.e.each(function(){g.v=jQuery(this),g.t=g.v.attr('title');if(!g.t){return};g.v.toggleClass('livestamp livestamped').attr('title',$.ccio.init('t',g.t)).livestamp(g.t);})
                return g.e
            break;
            case't'://format time
                if(!d){d=new Date();}
                return moment(d).format('YYYY-MM-DD HH:mm:ss')
            break;
            case'tf'://time to filename
                if(!d){d=new Date();}
                return moment(d).format('YYYY-MM-DDTHH-mm-ss')
            break;
            case'id':
                $('.usermail').html(d.mail)
                try{k.d=JSON.parse(d.details);}catch(er){k.d=d.details}
                $.each($user,function(n,v){$.sM.e.find('[name="'+n+'"]').val(v).change()})
                $.each(k.d,function(n,v){$.sM.e.find('[detail="'+n+'"]').val(v).change()})
            break;
            case'jsontoblock'://draw json as block
                if(d instanceof Object){
                    $.each(d,function(n,v){
                        k.tmp+='<div>';
                        k.tmp+='<b>'+n+'</b> : '+$.ccio.init('jsontoblock',v);
                        k.tmp+='</div>';
                    })
                }else{
                    k.tmp+='<span>';
                    k.tmp+=d;
                    k.tmp+='</span>';
                }
            break;
            case'url':
                if(d.port==80){d.porty=''}else{d.porty=':'+d.port}
                d.url=d.protocol+'://'+d.host+d.porty;return d.url;
            break;
            case'data-video':
                if(!d){
                    $('[data-mid]').each(function(n,v){
                        v=$(v);v.attr('mid',v.attr('data-mid'))
                    });
                    $('[data-ke]').each(function(n,v){
                        v=$(v);v.attr('ke',v.attr('data-ke'))
                    });
                    $('[data-file]').each(function(n,v){
                        v=$(v);v.attr('file',v.attr('data-file'))
                    });
                    $('[data-status]').each(function(n,v){
                        v=$(v);v.attr('status',v.attr('data-status'))
                    });
                }else{
                    $('[data-ke="'+d.ke+'"][data-mid="'+d.mid+'"][data-file="'+d.filename+'"]').attr('mid',d.mid).attr('ke',d.ke).attr('status',d.status).attr('file',d.filename);
                }
            break;
            case'signal':
                d.mon=$.ccio.mon[d.id];d.e=$('#monitor_live_'+d.id+' .signal').addClass('btn-success').removeClass('btn-danger');d.signal=parseFloat(JSON.parse(d.mon.details).signal_check);
                if(!d.signal||d.signal==NaN){d.signal=10;};d.signal=d.signal*1000*60;
                clearTimeout($.ccio.mon[d.id]._signal);$.ccio.mon[d.id]._signal=setTimeout(function(){d.e.addClass('btn-danger').removeClass('btn-success');},d.signal)
            break;
            case'signal-check':
                try{
                d.mon=$.ccio.mon[d.id];d.p=$('#monitor_live_'+d.id);
                    try{d.d=JSON.parse(d.mon.details)}catch(er){d.d=d.mon.details;}
                d.check={c:0};
                d.fn=function(){
                    if(!d.speed){d.speed=1000}
                    switch(d.d.stream_type){
                        case'b64':
                            d.p.resize()
                        break;
                        case'hls':
                            if(d.p.find('video')[0].paused){
                                if(d.d.signal_check_log==1){
                                    d.log={type:'Stream Check',msg:'Client side ctream check failed, attempting reconnect.'}
                                    $.ccio.tm(4,d,'#logs,.monitor_item[mid="'+d.id+'"][ke="'+d.ke+'"] .logs')
                                }
                                $.ccio.cx({f:'monitor',ff:'watch_on',id:d.id});
                            }else{
                                if(d.d.signal_check_log==1){
                                    d.log={type:'Stream Check',msg:'Success'}
                                    $.ccio.tm(4,d,'#logs,.monitor_item[mid="'+d.id+'"][ke="'+d.ke+'"] .logs')
                                }
                                $.ccio.init('signal',d);
                            }
                        break;
                        default:
                            $.ccio.snapshot(d,function(e,url){
                                d.check.f=url;
                                setTimeout(function(){
                                    $.ccio.snapshot(d,function(e,url){
                                        if(d.check.f===url){
                                            if(d.check.c<3){
                                                ++d.check.c;
                                                setTimeout(function(){
                                                    d.fn();
                                                },d.speed)
                                            }else{
                                                if(d.d.signal_check_log==1){
                                                    d.log={type:'Stream Check',msg:'Client side ctream check failed, attempting reconnect.'}
                                                    $.ccio.tm(4,d,'#logs,.monitor_item[mid="'+d.id+'"][ke="'+d.ke+'"] .logs')
                                                }
                                                delete(d.check)
                                                $.ccio.cx({f:'monitor',ff:'watch_on',id:d.id});
                                            }
                                        }else{
                                            if(d.d.signal_check_log==1){
                                                d.log={type:'Stream Check',msg:'Success'}
                                                $.ccio.tm(4,d,'#logs,.monitor_item[mid="'+d.id+'"][ke="'+d.ke+'"] .logs')
                                            }
                                            delete(d.check)
                                            $.ccio.init('signal',d);
                                        }
                                    });
                                },d.speed)
                            });
                        break;
                    }
                }
                d.fn();
                }catch(er){
                    er=er.stack;
                    d.in=function(x){return er.indexOf(x)>-1}
                    switch(true){
                        case d.in("The HTMLImageElement provided is in the 'broken' state."):
                            delete(d.check)
                            $.ccio.cx({f:'monitor',ff:'watch_on',id:d.id});
                        break;
                        default:
                            console.log('signal-check',er)
                        break;
                    }
                    clearInterval($.ccio.mon[d.id].signal);delete($.ccio.mon[d.id].signal);
                }
            break;
        }
        return k.tmp;
    }
    $.ccio.snapshot=function(e,cb){
        var image_data;
        switch(JSON.parse(e.mon.details).stream_type){
            case'hls':
                $('#temp').html('<canvas></canvas>')
                var c = $('#temp canvas')[0];
                var img = e.p.find('video')[0];
//                img.pause();
                c.width = img.videoWidth;
                c.height = img.videoHeight;
                var ctx = c.getContext('2d');
                ctx.drawImage(img, 0, 0);
                image_data=atob(c.toDataURL('image/jpeg').split(',')[1]);
//                img.play();
            break;
            case'mjpeg':
                $('#temp').html('<canvas></canvas>')
                var c = $('#temp canvas')[0];
                var img = $('img',e.p.find('.stream-element').contents())[0];
                c.width = img.width;
                c.height = img.height;
                var ctx = c.getContext('2d');
                ctx.drawImage(img, 0, 0);
                image_data=atob(c.toDataURL('image/jpeg').split(',')[1]);
            break;
            case'b64':
                image_data = atob(e.mon.last_frame.split(',')[1]);
            break;
        }
        var arraybuffer = new ArrayBuffer(image_data.length);
        var view = new Uint8Array(arraybuffer);
        for (var i=0; i<image_data.length; i++) {
            view[i] = image_data.charCodeAt(i) & 0xff;
        }
        try {
            var blob = new Blob([arraybuffer], {type: 'application/octet-stream'});
        } catch (e) {
            var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
            bb.append(arraybuffer);
            var blob = bb.getBlob('application/octet-stream');
        }
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        cb(url,image_data);
        URL.revokeObjectURL(url)
    }
    $.ccio.tm=function(x,d,z,k){
        var tmp='';if(!d){d={}};if(!k){k={}};
        if(d.id&&!d.mid){d.mid=d.id;}
        switch(x){
            case 0://video
                if(!d.filename){d.filename=moment(d.time).format('YYYY-MM-DDTHH-mm-ss')+'.'+d.ext;}
                k=[d.mid+'-'+d.filename,'href="/'+$user.auth_token+'/videos/'+d.ke+'/'+d.mid+'/'+d.filename+'"'];
                d.mom=moment(d.time),d.hr=parseInt(d.mom.format('HH')),d.per=parseInt(d.hr/24*100);
                tmp+='<li class="glM'+d.mid+'" mid="'+d.mid+'" ke="'+d.ke+'" status="'+d.status+'" file="'+d.filename+'"><div title="at '+d.hr+' hours of '+d.mom.format('MMMM DD')+'" '+k[1]+' video="launch" class="progress-circle progress-'+d.per+'"><span>'+d.hr+'</span></div><div><span title="'+d.end+'" class="livestamp"></span></div><div class="small"><b>Start</b> : '+d.time+'</div><div class="small"><b>End</b> : '+d.end+'</div><div><span class="pull-right">'+(parseInt(d.size)/1000000).toFixed(2)+'mb</span><div class="controls"><a class="btn btn-sm btn-primary" video="launch" '+k[1]+'><i class="fa fa-play-circle"></i></a> <a download="'+k[0]+'" '+k[1]+' class="btn btn-sm btn-default"><i class="fa fa-download"></i></a> <a video="download" host="dropbox" download="'+k[0]+'" '+k[1]+' class="btn btn-sm btn-default"><i class="fa fa-dropbox"></i></a> <a title="Delete Video" video="delete" class="btn btn-sm btn-danger"><i class="fa fa-trash"></i></a></div></div></li>';
            break;
            case 1://monitor icon
                d.src=placeholder.getData(placeholder.plcimg({bgcolor:'#b57d00',text:'...'}));
                tmp+='<div mid="'+d.mid+'" ke="'+d.ke+'" title="'+d.mid+' : '+d.name+'" class="monitor_block glM'+d.mid+' col-md-4"><img monitor="watch" class="snapshot" src="'+d.src+'"><div class="box"><div class="title monitor_name truncate">'+d.name+'</div><div class="list-data"><div class="monitor_mid">'+d.mid+'</div><div><b>Save as :</b> <span class="monitor_ext">'+d.ext+'</span></div><div><b>Mode :</b> <span class="monitor_mode">'+d.mode+'</span></div></div><div class="icons btn-group"><a class="btn btn-xs btn-default" monitor="edit"><i class="fa fa-wrench"></i></a> <a monitor="calendar" class="btn btn-xs btn-default"><i class="fa fa-calendar"></i></a> <a monitor="videos_table" class="btn btn-xs btn-default"><i class="fa fa-film"></i></a></div></div></div>';
                delete(d.src);
            break;
            case 2://monitor stream
                try{k.d=JSON.parse(d.details);}catch(er){k.d=d.details;}
//                tmp+='<div mid="'+d.mid+'" ke="'+d.ke+'" id="monitor_live_'+d.mid+'" class="monitor_item glM'+d.mid+' col-md-4">';
                switch(d.mode){
                    case'stop':
                        k.mode='Disabled'
                    break;
                    case'record':
                        k.mode='Record'
                    break;
                    case'start':
                        k.mode='Watch Only'
                    break;
                }
//                tmp+='<div class="hud super-center"><div class="top_bar"><span class="badge badge-sm badge-danger"><i class="fa fa-eye"></i> <span class="viewers"></span></span></div><div class="bottom_bar"></div></div></div></div>';
                
                tmp+='<div mid="'+d.mid+'" ke="'+d.ke+'" id="monitor_live_'+d.mid+'" class="monitor_item glM'+d.mid+' mdl-grid col-md-6">';
                tmp+='<div class="mdl-card mdl-cell mdl-cell--8-col">';
                tmp+='<div class="no-padding mdl-card__media mdl-color-text--grey-50">';
                switch(k.d.stream_type){
                    case'mjpeg':
                        tmp+='<iframe class="stream-element"></iframe>';
                    break;
                    case'hls':
                        tmp+='<video class="stream-element" autoplay></video>';
                    break;
                    default://base64
                        tmp+='<canvas class="stream-element"></canvas>';
                    break;
                }
                tmp+='</div>';
                tmp+='<div class="mdl-card__supporting-text text-center">';
                tmp+='<div class="btn-group btn-group-lg"><a title="Snapshot" monitor="snapshot" class="btn btn-primary"><i class="fa fa-camera"></i></a> <a title="Show Logs" class_toggle="show_logs" data-target=".monitor_item[mid=\''+d.mid+'\'][ke=\''+d.ke+'\']" class="btn btn-warning"><i class="fa fa-exclamation-triangle"></i></a> <a title="Enlarge" monitor="control_toggle" class="btn btn-default"><i class="fa fa-arrows"></i></a> <a title="Status Indicator, Click to Recconnect" class="btn btn-danger signal" monitor="watch_on"><i class="fa fa-circle"></i></a> <a title="Calendar" monitor="calendar" class="btn btn-default"><i class="fa fa-calendar"></i></a> <a title="Videos List" monitor="videos_table" class="btn btn-default"><i class="fa fa-film"></i></a> <a class="btn btn-default" monitor="edit"><i class="fa fa-wrench"></i></a> <a title="Enlarge" monitor="bigify" class="hidden btn btn-default"><i class="fa fa-expand"></i></a> <a title="Fullscreen" monitor="fullscreen" class="btn btn-default"><i class="fa fa-arrows-alt"></i></a> <a title="Close Stream" monitor="watch_off" class="btn btn-danger"><i class="fa fa-times"></i></a></div>';
                tmp+='</div>';
                tmp+='</div>';
                tmp+='<div class="mdl-card mdl-cell mdl-cell--8-col mdl-cell--4-col-desktop">';
                tmp+='<div class="mdl-card__media">';
                tmp+='<div class="side-menu logs scrollable"></div>';
                tmp+='<div class="side-menu videos_monitor_list glM'+d.mid+' scrollable"><ul></ul></div>';
                tmp+='</div>';
                tmp+='<div class="mdl-card__supporting-text meta meta--fill mdl-color-text--grey-600">';
                tmp+='<span class="monitor_name">'+d.name+'</span>';
                tmp+='<b class="monitor_mode">'+k.mode+'</b>';
                tmp+='</div>';
                tmp+='</div>';
                tmp+='</div>';
            break;
            case 3://api key row
                tmp+='<tr api_key="'+d.code+'"><td class="code">'+d.code+'</td><td class="ip">'+d.ip+'</td><td class="time">'+d.time+'</td><td><a class="delete btn btn-xs btn-danger">&nbsp;<i class="fa fa-trash"></i>&nbsp;</a></td></tr>';
            break;
            case 4://log row, draw to global and monitor
                if(!d.time){d.time=$.ccio.init('t')}
                tmp+='<li class="log-item">'
                tmp+='<span>'
                tmp+='<div>'+d.ke+' : <b>'+d.mid+'</b></div>'
                tmp+='<span>'+d.log.type+'</span> '
                tmp+='<b class="time livestamp" title="'+d.time+'"></b>'
                tmp+='</span>'
                tmp+='<div class="message">'
                tmp+=$.ccio.init('jsontoblock',d.log.msg);
                tmp+='</div>'
                tmp+='</li>';
                $(z).each(function(n,v){
                    v=$(v);
                    if(v.find('.log-item').length>10){v.find('.log-item:last').remove()}
                })
            break;
            case 5://region element
                k.contain='#region_editor .canvas_holder';
                if(!d.name){d.name=$.ccio.gid()}
                if(!d.sensitivity){d.sensitivity=0.5}
                if(!d.y){d.y=0}
                if(!d.x){d.x=0}
                if(!d.w){d.w=200}
                if(!d.h){d.h=200}
                $.zO.c.append('<div class="cord_element text-left" cord="'+d.name+'"><div class="controls"><a class="pull-right btn btn-xs btn-danger delete">&nbsp;<i class="fa fa-times"></i>&nbsp;</a></div><div class="form-group"><label><span>Region Name</span><input class="form-control input-sm" detail="name" value="'+d.name+'"></label></div><div class="form-group"><label><span>Sensitivity</span><input class="form-control input-sm" detail="sensitivity" value="'+d.sensitivity+'"></label></div></div>');
                $.zO.c.find('[cord="'+d.name+'"]')
                    .css({top:d.y,left:d.x,width:d.w,height:d.h})
                    .resizable({
                        containment:k.contain,
                        handles: "n,e,s,w,ne,nw,se,sw"
                    })
                    .draggable({
                        containment:k.contain,
                        stop: $.zO.checkCords
                    }).click()
            break;
            case'option':
                tmp+='<option value="'+d.id+'">'+d.name+'</option>'
            break;
        }
        if(z){
            $(z).prepend(tmp)
        }
        switch(x){
            case 0:case 4:
                $.ccio.init('ls');
            break;
            case 2:
                try{
            k.e=$('#monitor_live_'+d.mid);
            if(JSON.parse(d.details).control=="1"){k.e.find('[monitor="control_toggle"]').show()}else{k.e.find('.pad').remove();k.e.find('[monitor="control_toggle"]').hide()}
                }catch(re){console.log(re)}
            break;
        }
        return tmp;
    }
    $.ccio.pm=function(x,d,z,k){
        var tmp='';if(!d){d={}};
        switch(x){
            case 0:
                d.mon=$.ccio.mon[d.mid];
                d.ev='.glM'+d.mid+'.videos_list ul,.glM'+d.mid+'.videos_monitor_list ul';d.fr=$.ccio.fr.find(d.ev),d.tmp='';
                if(d.fr.length===0){$.ccio.fr.append('<div class="videos_list glM'+d.mid+'"><h3 class="title">'+d.mon.name+'</h3><ul></ul></div>')}
                if(d.videos&&d.videos.length>0){
                $.each(d.videos,function(n,v){
                    if(v.status!==0){
                        tmp+=$.ccio.tm(0,v)
                    }
                })
                }else{
                    $('.glM'+d.mid+'.videos_list,.glM'+d.mid+'.videos_monitor_list').appendTo($.ccio.fr)
                    tmp+='<li class="notice novideos">No videos for This Monitor</li>';
                }
                $(d.ev).html(tmp);
                $.ccio.init('ls');
            break;
            case 3:
                z='#api_list';
                $(z).empty();
                $.each(d,function(n,v){
                    tmp+=$.ccio.tm(3,v);
                })
            break;
            case'option':
                $.each(d,function(n,v){
                    tmp+=$.ccio.tm('option',v);
                })
            break;
        }
        if(z){
            $(z).prepend(tmp)
        }
        return tmp;
    }
    $.ccio.op=function(r,rr,rrr){
        if(!rrr){rrr={};};if(typeof rrr === 'string'){rrr={n:rrr}};if(!rrr.n){rrr.n='ShinobiOptions_'+location.host}
        ii={o:localStorage.getItem(rrr.n)};try{ii.o=JSON.parse(ii.o)}catch(e){ii.o={}}
        if(!ii.o){ii.o={}}
        if(r&&rr&&!rrr.x){
            ii.o[r]=rr;
        }
        switch(rrr.x){
            case 0:
                delete(ii.o[r])
            break;
            case 1:
                delete(ii.o[r][rr])
            break;
        }
        localStorage.setItem(rrr.n,JSON.stringify(ii.o))
        return ii.o
    }
$.ccio.ws=io(location.origin);
$.ccio.ws.on('connect',function (d){
    $.ccio.init('id',$user);
    $.ccio.cx({f:'init',ke:$user.ke,auth:$user.auth_token,uid:$user.uid})
})
PNotify.prototype.options.styling = "fontawesome";
$.ccio.ws.on('ping', function(d){
    $.ccio.ws.emit('pong',{beat:1});
});
$.ccio.ws.on('f',function (d){
    if(d.f!=='monitor_frame'&&d.f!=='os'&&d.f!=='video_delete'&&d.f!=='detector_trigger'&&d.f!=='log'){console.log(d);}
    if(d.viewers){
        $('#monitor_live_'+d.id+' .viewers').html(d.viewers);
    }
    switch(d.f){
        case'api_key_deleted':
            new PNotify({title:'API Key Deleted',text:'Key has been deleted. It will no longer work.',type:'notice'});
            $('[api_key="'+d.form.code+'"]').remove();
        break;
        case'api_key_added':
            new PNotify({title:'API Key Added',text:'You may use this key now.',type:'success'});
            $.ccio.tm(3,d.form,'#api_list')
        break;
        case'user_settings_change':
            new PNotify({title:'Settings Changed',text:'Your settings have been saved and applied.',type:'success'});
            $.ccio.init('id',d.form);
            $('#custom_css').append(d.form.details.css)
        break;
        case'ffprobe_stop':
            $.pB.o.append('<div><b>END</b></div>');
            $.pB.e.find('.stop').hide();
            $.pB.e.find('[type="submit"]').show();
        break;
        case'ffprobe_start':
            $.pB.o.empty();
            $.pB.e.find('.stop').show();
            $.pB.e.find('[type="submit"]').hide();
        break;
        case'ffprobe_data':
            $.pB.o.append(d.data+'<br>')
        break;
        case'detector_trigger':
            d.e=$('.monitor_item[ke="'+d.ke+'"][mid="'+d.id+'"]')
            if($.ccio.mon[d.id]&&d.e.length>0){
                d.e.addClass('detector_triggered')
                clearTimeout($.ccio.mon[d.id].detector_trigger_timeout);
                $.ccio.mon[d.id].detector_trigger_timeout=setTimeout(function(){
                    $('.monitor_item[ke="'+d.ke+'"][mid="'+d.id+'"]').removeClass('detector_triggered')
                },5000)
            }
        break;
        case'detector_plugged':
            $('.shinobi-detector').show()
            $('.shinobi-detector_name').text(d.plug)
            $('.shinobi-detector-'+d.plug).show()
            $('.shinobi-detector-invert').hide()
        break;
        case'detector_unplugged':
            $('.shinobi-detector').hide()
            $('.shinobi-detector_name').empty()
            $('.shinobi-detector_plug').hide()
            $('.shinobi-detector-invert').show()
        break;
        case'log':
            $.ccio.tm(4,d,'#logs,.monitor_item[mid="'+d.mid+'"][ke="'+d.ke+'"] .logs')
        break;
        case'os'://indicator
            //cpu
            d.cpu=parseFloat(d.cpu).toFixed(0)+'%';
            $('.cpu_load .progress-bar').css('width',d.cpu);
            $('.cpu_load .percent').html(d.cpu);
            //ram
            d.ram=(100-parseFloat(d.ram)).toFixed(0)+'%';
            $('.ram_load .progress-bar').css('width',d.ram);
            $('.ram_load .percent').html(d.ram);
        break;
        case'disk':
            d.tmp='';
            $.each(d.data,function(n,v){
                if(v.capacity!==0){
                    d.tmp+='<li class="log-item">'
                    d.tmp+=$.ccio.init('jsontoblock',v);
                    d.tmp+='<div class="progress"><div class="progress-bar progress-bar-primary" role="progressbar" style="width:'+v.capacity*100+'%;"></div></div>'
                    d.tmp+='</li>'
                }
            })
            $('#disk').html(d.tmp)
        break;
        case'init_success':
            $('#monitors_list').empty();
            d.o=$.ccio.op().watch_on;
            if(!d.o){d.o={}};
            $.each(d.monitors,function(n,v){
                $.ccio.mon[v.mid]=v;
                $.ccio.tm(1,v,'#monitors_list')
                if(d.o[v.ke]&&d.o[v.ke][v.mid]===1){$.ccio.cx({f:'monitor',ff:'watch_on',id:v.mid})}
            });
            $.ccio.pm(3,d.apis);
            $('.os_platform').html(d.os.platform)
            $('.os_cpuCount').html(d.os.cpuCount)
            $('.os_totalmem').html((d.os.totalmem/1000000).toFixed(2))
            if(d.os.cpuCount>1){
                $('.os_cpuCount_trailer').html('s')
            }
        break;
        case'get_videos':
            $.ccio.pm(0,d)
        break;
        case'video_delete':
            if($('.modal[mid="'+d.mid+'"]').length>0){$('#video_viewer[mid="'+d.mid+'"]').attr('file',null).attr('ke',null).attr('mid',null).modal('hide')}
            $('[file="'+d.filename+'"][mid="'+d.mid+'"][ke="'+d.ke+'"]').remove();
        break;
        case'video_build_success':
            if(!d.mid){d.mid=d.id;};d.status=1;
            d.e='.glM'+d.mid+'.videos_list ul,.glM'+d.mid+'.videos_monitor_list ul';$(d.e).find('.notice.novideos').remove();
            $.ccio.tm(0,d,d.e)
        break;
//        case'monitor_stopping':
//            new PNotify({title:'Monitor Stopping',text:'Monitor <b>'+d.mid+'</b> is now off.',type:'notice'});
//        break;
        case'monitor_starting':
//            switch(d.mode){case'start':d.mode='Watch';break;case'record':d.mode='Record';break;}
//            new PNotify({title:'Monitor Starting',text:'Monitor <b>'+d.mid+'</b> is now running in mode <b>'+d.mode+'</b>',type:'success'});
            d.e=$('#monitor_live_'+d.mid)
            if(d.e.length>0){$.ccio.cx({f:'monitor',ff:'watch_on',id:d.mid})}
        break;
        case'monitor_snapshot':
            switch(d.snapshot_format){
                case'plc':
                    $('[mid="'+d.mid+'"] .snapshot').attr('src',placeholder.getData(placeholder.plcimg(d.snapshot)))
                break;
                case'ab':
                    d.reader = new FileReader();
                    d.reader.addEventListener("loadend",function(){$('[mid="'+d.mid+'"] .snapshot').attr('src',d.reader.result)});
                    d.reader.readAsDataURL(new Blob([d.snapshot],{type:"image/jpeg"}));
                break;
                case'b64':
                    $('[mid="'+d.mid+'"][ke="'+d.ke+'"] .snapshot').attr('src','data:image/jpeg;base64,'+d.snapshot)
                break;
            }
        break;
        case'monitor_delete':
            $('[mid="'+d.mid+'"][ke="'+d.ke+'"]:not(.modal)').remove();
            delete($.ccio.mon[d.mid]);
        break;
        case'video_edit':
            $.ccio.init('data-video',d)
            d.e=$('[file="'+d.filename+'"][mid="'+d.mid+'"][ke="'+d.ke+'"]');
            d.e.attr('status',d.status),d.e.attr('data-status',d.status);
        break;
        case'monitor_edit':
            d.e=$('[mid="'+d.mon.mid+'"][ke="'+d.mon.ke+'"]');d.ee=d.e.find('.stream-element');
            switch(d.mon.details.stream_type){
                case'hls':
                    d.ee.after('<video class="stream-element" autoplay></video>').remove()
                break;
                case'mjpeg':
                    d.ee.after('<iframe class="stream-element"></iframe>').remove()
                break;
                default://base64
                    d.ee.after('<canvas class="stream-element"></canvas>').remove()
                break;
            }
            d.e.resize();
            d.e=$('#monitor_live_'+d.mid);
            if(d.mon.details.control=="1"){d.e.find('[monitor="control_toggle"]').show()}else{d.e.find('.pad').remove();d.e.find('[monitor="control_toggle"]').hide()}
            
            d.o=$.ccio.op().watch_on;
            if(!d.o){d.o={}}
            if(d.mon.details.cords instanceof Array){d.mon.details.cords=JSON.stringify(d.mon.details.cords);}
            d.mon.details=JSON.stringify(d.mon.details);
            if(!$.ccio.mon[d.mid]){$.ccio.mon[d.mid]={}}
            $.each(d.mon,function(n,v){
                $.ccio.mon[d.mid][n]=v;
            });
            if(d.new===true){$.ccio.tm(1,d.mon,'#monitors_list')}
            switch(d.mon.mode){
//                case'stop':d.e.remove();break;
                case'start':case'record':
                    if(d.o[d.ke]&&d.o[d.ke][d.mid]===1){$.ccio.cx({f:'monitor',ff:'watch_on',id:d.mid})}
                break;
            }
            
            d.e=$('.glM'+d.mon.mid);
            d.e.find('.monitor_name').text(d.mon.name)
            d.e.find('.monitor_mid').text(d.mon.mid)
            d.e.find('.monitor_ext').text(d.mon.ext);
                switch(d.mon.mode){
                    case'stop':
                        d.mode='Disabled'
                    break;
                    case'record':
                        d.mode='Record'
                    break;
                    case'start':
                        d.mode='Watch Only'
                    break;
                }
            d.e.find('.monitor_mode').text(d.mode)
        break;
        case'monitor_watch_off':case'monitor_stopping':
            d.o=$.ccio.op().watch_on;if(!d.o[d.ke]){d.o[d.ke]={}};d.o[d.ke][d.id]=0;$.ccio.op('watch_on',d.o);
            if($.ccio.mon[d.id]){
                clearTimeout($.ccio.mon[d.id].sk)
                clearInterval($.ccio.mon[d.id].signal);delete($.ccio.mon[d.id].signal);
                $.ccio.mon[d.id].watch=0;
                $('#monitor_live_'+d.id).remove();
            }
        break;
        case'monitor_watch_on':
            d.o=$.ccio.op().watch_on;if(!d.o){d.o={}};if(!d.o[d.ke]){d.o[d.ke]={}};d.o[d.ke][d.id]=1;$.ccio.op('watch_on',d.o);
            $.ccio.mon[d.id].watch=1;
            d.e=$('#monitor_live_'+d.id);
            if(d.e.length==0){
                $.ccio.tm(2,$.ccio.mon[d.id],'#monitors_live');
            }
            d.d=JSON.parse($.ccio.mon[d.id].details);
            switch(d.d.stream_type){
                case'hls':
                    d.url=$user.auth_token+'/hls/'+d.ke+'/'+d.id+'/s.m3u8';
                    var video = $('#monitor_live_'+d.id+' .stream-element')[0];
                    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)||(navigator.userAgent.match(/(Safari)/)&&!navigator.userAgent.match('Chrome'))) {
                        video.src=d.url;
                        if (video.paused) {
                            video.play();
                        }
                    }else{
                        var hls = new Hls();
                        hls.loadSource(d.url);
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED,function() {
                            if (video.paused) {
                                video.play();
                            }
                        });
                    }
                    clearTimeout($.ccio.mon[d.id].sk);
                    if(d.d.signal_check!=='0'){
                        $.ccio.mon[d.id].sk=setTimeout(function(){
                            $.ccio.init('signal-check',d)
                        },15000)
                    }
                break;
                case'mjpeg':
                    $('#monitor_live_'+d.id+' .stream-element').attr('src',$user.auth_token+'/mjpeg/'+d.ke+'/'+d.id+'/full')
                break;
            }
            d.signal=parseFloat(d.d.signal_check);
            if(!d.signal||d.signal==NaN){d.signal=10;};d.signal=d.signal*1000*60;
            if(d.signal>0){
                $.ccio.mon[d.id].signal=setInterval(function(){$.ccio.init('signal-check',{id:d.id,ke:d.ke})},d.signal);
            }
            d.e=$('.monitor_item[mid="'+d.id+'"][ke="'+d.ke+'"]').resize()
            if(d.e.find('.videos_monitor_list li').length===0){
                $.getJSON('/'+$user.auth_token+'/videos/'+d.ke+'/'+d.id+'?limit=10',function(f){
                    $.ccio.pm(0,{videos:f,ke:d.ke,mid:d.id})
                })
            }
        break;
        case'monitor_mjpeg_url':
            $('#monitor_live_'+d.id+' iframe').attr('src',location.protocol+'//'+location.host+d.watch_url);
        break;
        case'monitor_frame':
            var image = new Image();
            var ctx = $('#monitor_live_'+d.id+' canvas');
            image.onload = function() {
                ctx[0].getContext("2d").drawImage(image,0,0,ctx.width(),ctx.height());
            };
            image.src='data:image/jpeg;base64,'+d.frame;
            $.ccio.mon[d.id].last_frame='data:image/jpeg;base64,'+d.frame;
            $.ccio.init('signal',d);
        break;
        case'onvif':
            if(d.url){d.url=$.ccio.init('jsontoblock',d.url)}else{d.url='URL not Found'}
            $('#onvif_probe .output_data').append('<tr><td class="ip">'+d.ip+'</td><td class="port">'+d.port+'</td><td>'+$.ccio.init('jsontoblock',d.info)+'</td><td class="url">'+d.url+'</td><td class="date">'+d.date+'</td><td><a class="btn btn-sm btn-primary copy">&nbsp;<i class="fa fa-copy"></i>&nbsp;</a></td></tr>')
        break;
    }
    delete(d);
});
$.ccio.cx=function(x){if(!x.ke){x.ke=$user.ke;};if(!x.uid){x.uid=$user.uid;};return $.ccio.ws.emit('f',x)}

//global form functions
$.ccio.form={};
$.ccio.form.details=function(e){
    e.ar={},e.f=$(this).parents('form');
    $.each(e.f.find('[detail]'),function(n,v){
        v=$(v);e.ar[v.attr('detail')]=v.val();
    });
    e.f.find('[name="details"]').val(JSON.stringify(e.ar));
};
//onvif probe
$.oB={e:$('#onvif_probe')};$.oB.f=$.oB.e.find('form');$.oB.o=$.oB.e.find('.output_data');
$.oB.f.submit(function(e){
    e.preventDefault();e.e=$(this),e.s=e.e.serializeObject();
    $.oB.o.empty();
    $.ccio.cx({f:'onvif',ip:e.s.ip,port:e.s.port,user:e.s.user,pass:e.s.pass})
    setTimeout(function(){
        if($.oB.o.find('tr').length===0){
            $.oB.o.append('<td class="text-center">Sorry, nothing was found.</td>')
        }
    },5000)
    return false;
});
$.oB.e.on('click','.copy',function(e){
    e.e=$(this).parents('tr');
    $('.hidden-xs [monitor="edit"]').click();
    e.host=e.e.find('.ip').text();
    if($.oB.e.find('[name="user"]').val()!==''){
        e.host=$.oB.e.find('[name="user"]').val()+':'+$.oB.e.find('[name="pass"]').val()+'@'+e.host
    }
    $.aM.e.find('[name="host"]').val(e.host)
    $.aM.e.find('[name="port"]').val(e.e.find('.port').text())
    $.aM.e.find('[name="type"] [value="h264"]').prop('selected',true).parent().change()
    $.aM.e.find('[name="path"]').val($.ccio.init('getLocation',e.e.find('.url b:contains("uri")').next().text().trim().replace('rtsp','http')).pathname)
})
$.oB.e.find('[name="ip"]').change(function(e){
    $.ccio.op('onvif_probe_ip',$(this).val());
})
if($.ccio.op().onvif_probe_ip){
    $.oB.e.find('[name="ip"]').val($.ccio.op().onvif_probe_ip)
}
$.oB.e.find('[name="port"]').change(function(e){
    $.ccio.op('onvif_probe_port',$(this).val());
})
if($.ccio.op().onvif_probe_port){
    $.oB.e.find('[name="port"]').val($.ccio.op().onvif_probe_port)
}
$.oB.e.find('[name="user"]').change(function(e){
    $.ccio.op('onvif_probe_user',$(this).val());
})
if($.ccio.op().onvif_probe_user){
    $.oB.e.find('[name="user"]').val($.ccio.op().onvif_probe_user)
}
//Region Editor
$.zO={e:$('#region_editor')};$.zO.f=$.zO.e.find('form');$.zO.o=$.zO.e.find('canvas'),$.zO.c=$.zO.e.find('.canvas_holder');
$.zO.f.submit(function(e){
    e.preventDefault();e.e=$(this),e.s=e.e.serializeObject();
    
    return false;
});
$.zO.checkCords=function(){
    e={};e.ar=[];
    $.zO.c.find('[cord]').each(function(n,v){
        v=$(v);e.o=v.position();
        e.arr={name:e.n,x:e.o.left,y:e.o.top,w:v.width(),h:v.height()};
        v.find('[detail]').each(function(m,b){
            b=$(b);
            e.arr[b.attr('detail')]=b.val().trim();
        })
        if(e.n==''){e.n=$.ccio.gid()};
        e.ar.push(e.arr);
    });
    $.aM.e.find('[detail="cords"]').val(JSON.stringify(e.ar)).change()
}
$.zO.c.on('change','input',$.zO.checkCords)
.on('resize','[cord]',$.zO.checkCords)
.on('mousedown touch','[cord]',function(){
    $.zO.c.find('[cord]').removeClass('selected');
    $(this).addClass('selected');
})
.on('click','.delete',function(){
    $(this).parents('[cord]').remove();
    $.zO.checkCords();
});
$.zO.e.on('click','.add',function(){
    $.ccio.tm(5)
})
//probe
$.pB={e:$('#probe')};$.pB.f=$.pB.e.find('form');$.pB.o=$.pB.e.find('.output_data');
$.pB.f.submit(function(e){
    e.preventDefault();e.e=$(this),e.s=e.e.serializeObject();
    e.s.url=e.s.url.trim();
    if(e.s.url.indexOf('-i ')===-1){
        e.s.url='-i '+e.s.url
    }
    $.ccio.cx({f:'ffprobe',query:e.s.url})
    return false;
});
$.pB.e.find('.stop').click(function(e){
    e.e=$(this);
    $.ccio.cx({f:'ffprobe',ff:'stop'})
});
//log viewer
$.log={e:$('#logs_modal'),lm:$('#log_monitors')};$.log.o=$.log.e.find('table tbody');
$.log.e.on('shown.bs.modal', function () {
    $.each($.ccio.mon,function(n,v){
        v.id=v.mid;
        $.ccio.tm('option',v,'#log_monitors')
    })
    $.log.lm.change()
});
$.log.lm.change(function(e){
    e.v=$(this).val();
    if(e.v==='all'){e.v=''}
    $.get('/'+$user.auth_token+'/logs/'+$user.ke+'/'+e.v,function(d){
        e.tmp='';
        $.each(d,function(n,v){
            e.tmp+='<tr class="search-row"><td title="'+v.time+'" class="livestamp"></td><td>'+v.time+'</td><td>'+$.ccio.mon[v.mid].name+'</td><td>'+v.mid+'</td><td>'+$.ccio.init('jsontoblock',v.info)+'</td></tr>'
        })
        $.log.o.html(e.tmp)
        $.ccio.init('ls')
    })
});
//add Monitor
$.aM={e:$('#add_monitor')};$.aM.f=$.aM.e.find('form')
$.aM.f.submit(function(e){
    e.preventDefault();e.e=$(this),e.s=e.e.serializeObject();
    e.er=[];
    $.each(e.s,function(n,v){e.s[n]=v.trim()});
    e.s.mid=e.s.mid.replace(/[^\w\s]/gi,'').replace(/ /g,'')
    if(e.s.mid.length<3){e.er.push('Monitor ID too short')}
    if(e.s.port==''){e.s.port=80}
    if(e.s.name==''){e.er.push('Monitor Name cannot be blank')}
//    if(e.s.protocol=='rtsp'){e.s.ext='mp4',e.s.type='rtsp'}
    if(e.er.length>0){
        $.sM.e.find('.msg').html(e.er.join('<br>'));
        new PNotify({title:'Configuration Invalid',text:e.er.join('<br>'),type:'error'});
        return;
    }
        $.ccio.cx({f:'monitor',ff:'add',mon:e.s})
        if(!$.ccio.mon[e.s.mid]){$.ccio.mon[e.s.mid]={}}
        $.each(e.s,function(n,v){$.ccio.mon[e.s.mid][n]=v;})
        $.aM.e.modal('hide')
    return false;
});
$.aM.e.find('.probe_config').click(function(){
    e={};
    e.host=$.aM.e.find('[name="host"]').val();
    e.protocol=$.aM.e.find('[name="protocol"]').val();
    e.port=$.aM.e.find('[name="port"]').val();
    e.path=$.aM.e.find('[name="path"]').val();
    if($.aM.e.find('[name="type"]').val()==='local'){
        e.url=e.path;
    }else{
        e.url=$.ccio.init('url',e)+e.path;
    }
    $.pB.e.find('[name="url"]').val(e.url);
    $.pB.f.submit();
    $.pB.e.modal('show');
})
$.aM.e.find('.import_config').click(function(e){
    e={};e.e=$(this);e.mid=e.e.parents('[mid]').attr('mid');
    $.confirm.e.modal('show');
    $.confirm.title.text('Import Monitor Configuration')
    e.html='Doing this will overrwrite any changes currently not saved. Imported changes will only be applied when you press <b>Save</b>.<div style="margin-top:15px"><div class="form-group"><textarea placeholder="Paste JSON here." class="form-control"></textarea></div><label class="upload_file btn btn-primary btn-block"> Upload File <input class="upload" type=file name="files[]"></label></div>';
    $.confirm.body.html(e.html)
    $.confirm.e.find('.upload').change(function(e){
        var files = e.target.files; // FileList object
        f = files[0];
        var reader = new FileReader();
        reader.onload = function(ee) {
            $.confirm.e.find('textarea').val(ee.target.result);
        }
        reader.readAsText(f);
    });
    $.confirm.click({title:'Import',class:'btn-primary'},function(){
        try{
            e.values=JSON.parse($.confirm.e.find('textarea').val());
            $.each(e.values,function(n,v){
                $.aM.e.find('[name="'+n+'"]').val(v).change()
            })
            e.ss=JSON.parse(e.values.details);
            $.aM.f.find('[detail]').each(function(n,v){
                v=$(v).attr('detail');if(!e.ss[v]){e.ss[v]=''}
            })
            $.each(e.ss,function(n,v){
                $.aM.e.find('[detail="'+n+'"]').val(v).change();
            })
            $.aM.e.modal('show')
        }catch(err){
            console.log(err)
            new PNotify({title:'Invalid JSON',text:'Please ensure this is a valid JSON string for Shinobi monitor configuration.',type:'error'})
        }
    });
});
$.aM.e.find('.save_config').click(function(e){
    e={};e.e=$(this);e.mid=e.e.parents('[mid]').attr('mid');e.s=$.aM.f.serializeObject();
    if(!e.mid||e.mid===''){
        e.mid='NewMonitor'
    }
    e.dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(e.s));
    $('#temp').html('<a></a>')
        .find('a')
        .attr('href',e.dataStr)
        .attr('download','Shinobi_'+e.mid+'_config.json')
        [0].click()
});
$.aM.f.find('[name="type"]').change(function(e){
    e.e=$(this);
    if(e.e.val()==='h264'){$.aM.f.find('[name="protocol"]').val('rtsp').change()}
})
$.aM.md=$.aM.f.find('[detail]');
$.aM.md.change($.ccio.form.details)
$.aM.f.find('[name="mode"]').change(function(e){
    e.v=$(this).val();
    $.aM.f.find('.h_m_input').hide()
    $.aM.f.find('.h_m_'+e.v).show();
});
$.aM.f.find('[detail="control"]').change(function(e){
    e.v=$(this).val();
    $.aM.f.find('.h_c_input').hide()
    $.aM.f.find('.h_c_'+e.v).show();
});
$.aM.f.find('[detail="control_stop"]').change(function(e){
    e.v=$(this).val();
    $.aM.f.find('.h_cs_input').hide()
    $.aM.f.find('.h_cs_'+e.v).show();
});
$.aM.f.find('[detail="stream_type"]').change(function(e){
    e.v=$(this).val();
    $.aM.f.find('.h_st_input').hide()
    $.aM.f.find('.h_st_'+e.v).show();
});
$.aM.f.find('[name="ext"]').change(function(e){
    e.v=$(this).val();
    $.aM.f.find('.h_f_input').hide()
    $.aM.f.find('.h_f_'+e.v).show();
});
$.aM.f.find('[name="type"]').change(function(e){
    e.e=$(this);
    e.v=e.e.val();
    $.aM.f.find('.h_t_input').hide()
    $.aM.f.find('.h_t_'+e.v).show();
    e.h=$.aM.f.find('[name="path"]');
    e.p=e.e.parents('.form-group');
    e.p.removeClass('col-md-12 col-md-6')
    switch(e.v){
        case'local':case'socket':
            e.p.addClass('col-md-12')
            e.h.attr('placeholder','/dev/video0')
        break;
        default:
            e.p.addClass('col-md-6')
            e.h.attr('placeholder','/videostream.cgi?1')
        break;
    }
});
$.aM.e.on('dblclick','.edit_id',function(e){
    $.aM.e.find('[name="mid"]').parents('.form-group').toggle('show')
})
//api window
$.apM={e:$('#apis')};$.apM.f=$.apM.e.find('form');
$.apM.md=$.apM.f.find('[detail]');
$.apM.md.change($.ccio.form.details);
$.apM.f.submit(function(e){
    e.preventDefault();e.e=$(this),e.s=e.e.serializeObject();
    e.er=[];
    if(!e.s.ip||e.s.ip.length<7){e.er.push('Enter atleast one IP')}
    if(e.er.length>0){$.apM.e.find('.msg').html(e.er.join('<br>'));return;}
    $.each(e.s,function(n,v){e.s[n]=v.trim()})
    $.ccio.cx({f:'api',ff:'add',form:e.s})
});
$.apM.e.on('click','.delete',function(e){
    e.e=$(this);e.p=e.e.parents('[api_key]'),e.code=e.p.attr('api_key');
    console.log(e.code)
    $.ccio.cx({f:'api',ff:'delete',form:{code:e.code}})
})
//settings window
$.sM={e:$('#settings')};$.sM.f=$.sM.e.find('form');
$.sM.md=$.sM.f.find('[detail]');
$.sM.md.change($.ccio.form.details);
$.sM.f.submit(function(e){
    e.preventDefault();e.e=$(this),e.s=e.e.serializeObject();
    e.er=[];
    if(e.s.pass!==''&&e.password_again===e.s.pass){e.er.push('Passwords don\'t match')};
    if(e.er.length>0){$.sM.e.find('.msg').html(e.er.join('<br>'));return;}
    $.each(e.s,function(n,v){e.s[n]=v.trim()})
    $.ccio.cx({f:'settings',ff:'edit',form:e.s})
    $.sM.e.modal('hide')
});
//confirm windows
$.confirm={e:$('#confirm_window')};
$.confirm.title=$.confirm.e.find('.modal-title span')
$.confirm.body=$.confirm.e.find('.modal-body')
$.confirm.click=function(x,e){
    if(!x.class){x.class='btn-success'}
    if(!x.title){x.title='Save changes'}
    x.e=$.confirm.e.find('.confirmaction').removeClass('btn-danger btn-warning btn-primary btn-success').addClass(x.class).text(x.title);
    x.e.click(function(){
        x.e.unbind('click');$.confirm.e.modal('hide');e();
    })
}
//videos window
$.vidview={e:$('#videos_viewer')};$.vidview.f=$.vidview.e.find('form')
$.vidview.e.on('change','#videos_select_all',function(e){
    e.e=$(this);
    e.p=e.e.prop('checked')
    e.a=$.vidview.e.find('input[type=checkbox][name]')
    if(e.p===true){
        e.a.prop('checked',true)
    }else{
        e.a.prop('checked',false)
    }
})
$.vidview.e.find('.delete_selected').click(function(e){
    e.s=$.vidview.f.serializeObject();
    $.confirm.e.modal('show');
    $.confirm.title.text('Delete Selected Videos')
    e.html='Do you want to delete these videos? You cannot recover them.<div style="margin-bottom:15px"></div>'
    $.each(e.s,function(n,v){
        e.html+=n+'<br>';
    })
    $.confirm.body.html(e.html)
    $.confirm.click({title:'Delete Video',class:'btn-danger'},function(){
        $.each(e.s,function(n,v){
            n=n.split('.')
            $.ccio.cx({f:'video',ff:'delete',status:1,filename:n[0],ext:n[1],mid:v});
        })
    });
})
//dynamic bindings
$('body')
.on('click','.logout',function(e){
    localStorage.removeItem('ShinobiLogin_'+location.host);location.href=location.href;
})
.on('click','[video]',function(e){
    e.e=$(this),
    e.a=e.e.attr('video'),
    e.p=e.e.parents('[mid]'),
    e.ke=e.p.attr('ke'),
    e.mid=e.p.attr('mid'),
    e.file=e.p.attr('file');
    e.status=e.p.attr('status');
    if(!e.ke||!e.mid){
        //for calendar plugin
        e.p=e.e.parents('[data-mid]'),
        e.ke=e.p.data('ke'),
        e.mid=e.p.data('mid'),
        e.file=e.p.data('file');
        e.status=e.p.data('status');
    }
    e.mon=$.ccio.mon[e.mid];
    switch(e.a){
        case'launch':
            e.preventDefault();
            e.href=$(this).attr('href'),e.e=$('#video_viewer');
            e.mon=$.ccio.mon[e.mid];
            e.e.find('.modal-title span').html(e.mon.name+' - '+e.file)
            e.e.find('.modal-body').html('<video class="video_video" video="'+e.href+'" autoplay loop controls><source src="'+e.href+'" type="video/'+e.mon.ext+'"></video>')
            e.e.attr('mid',e.mid);
            e.f=e.e.find('.modal-footer');
            e.f.find('.download_link').attr('href',e.href).attr('download',e.file);
            e.f.find('[monitor="download"][host="dropbox"]').attr('href',e.href);
            e.e.modal('show').attr('ke',e.ke).attr('mid',e.mid).attr('file',e.file);
            if(e.status==1){
                $.get(e.href+'/status/2',function(d){
                    console.log(d)
                })
            }
        break;
        case'delete':
            $.confirm.e.modal('show');
            $.confirm.title.text('Delete Video : '+e.file)
            e.html='Do you want to delete this video? You cannot recover it.'
            e.html+='<video class="video_video" autoplay loop controls><source src="'+e.p.find('[download]').attr('href')+'" type="video/'+e.mon.ext+'"></video>';
            $.confirm.body.html(e.html)
            $.confirm.click({title:'Delete Video',class:'btn-danger'},function(){
                e.file=e.file.split('.')
                $.ccio.cx({f:'video',ff:'delete',status:1,filename:e.file[0],ext:e.file[1],ke:e.ke,mid:e.mid});
            });
        break;
        case'download':
            e.preventDefault();
            switch(e.e.attr('host')){
                case'dropbox':
                    Dropbox.save(e.e.attr('href'),e.e.attr('download'),{progress: function (progress) {console.log(progress)},success: function () {
                        console.log("Success! Files saved to your Dropbox.");
                    }});
                break;
            }
        break;
    }
})
.on('click','[class_toggle]',function(e){
    e.e=$(this);
    e.n=e.e.attr('data-target');
    e.v=e.e.attr('class_toggle');
    e.o=$.ccio.op().class_toggle;
    if($(e.n).hasClass(e.v)){e.t=0}else{e.t=1}
    if(!e.o)e.o={};
    e.o[e.n]=[e.v,e.t];
    $.ccio.op('class_toggle',e.o)
    $(e.n).toggleClass(e.v);
})
.on('click','[monitor]',function(){
   e={}; e.e=$(this),e.a=e.e.attr('monitor'),e.p=e.e.parents('[mid]'),e.ke=e.p.attr('ke'),e.mid=e.p.attr('mid'),e.mon=$.ccio.mon[e.mid]
    switch(e.a){
        case'region':
            e.d=JSON.parse(e.mon.details);
            e.width=$.aM.e.find('[detail="detector_scale_x"]');
            e.height=$.aM.e.find('[detail="detector_scale_y"]');
            e.d.cords=$.aM.e.find('[detail="cords"]').val();
            if(e.width.val()===''){
                e.d.detector_scale_x=640;
                e.d.detector_scale_y=480;
                $.aM.e.find('[detail="detector_scale_x"]').val(e.d.detector_scale_x);
                $.aM.e.find('[detail="detector_scale_y"]').val(e.d.detector_scale_y);
            }else{
                e.d.detector_scale_x=e.width.val();
                e.d.detector_scale_y=e.height.val();
            }
            
            $.zO.e.modal('show');
            $.zO.o.attr('width',e.d.detector_scale_x).attr('height',e.d.detector_scale_y);
            $.zO.c.css({width:e.d.detector_scale_x,height:e.d.detector_scale_y});
            var blendContext = $.zO.o[0].getContext('2d');
            blendContext.fillStyle = '#005337';
            blendContext.fillRect( 0, 0,e.d.detector_scale_x,e.d.detector_scale_y);
            if(e.d.cords&&(e.d.cords instanceof Object)===false){
                try{e.d.cords=JSON.parse(e.d.cords);}catch(er){}
            }
            if(!e.d.cords||e.d.cords===''){
                e.d.cords=[
                    { name:"red",sensitivity:0.5, x:320 - 32 - 10, y:10, w:64, h:64 },
                    { name:"yellow",sensitivity:0.5, x:320 - 32 - 10, y:10, w:64, h:64 },
                    { name:"green",sensitivity:0.5, x:238, y:10, w:64, h:64 }
                ]
            }
            $.zO.c.find('.cord_element').remove()
            $.each(e.d.cords,function(n,v){
                $.ccio.tm(5,v)
            })
        break;
        case'snapshot':
            $.ccio.snapshot(e,function(url){
                $('#temp').html('<a href="'+url+'" download="'+$.ccio.init('tf')+'_'+e.ke+'_'+e.mid+'.jpg">a</a>').find('a')[0].click();
            });
        break;
        case'control':
            e.a=e.e.attr('control'),e.j=JSON.parse(e.mon.details);
            $.ccio.cx({f:'monitor',ff:'control',direction:e.a,mid:e.mid,ke:e.ke})
        break;
        case'videos_table':case'calendar'://call videos table or calendar
            $.getJSON('/'+$user.auth_token+'/videos/'+e.ke+'/'+e.mid,function(d){
                e.v=$.vidview.e;e.o=e.v.find('.options').hide()
                e.b=e.v.modal('show').find('.modal-body');
                e.t=e.v.find('.modal-title i');
                switch(e.a){
                    case'calendar':
                       e.t.attr('class','fa fa-calendar')
                       e.ar=[];
                        $.each(d,function(n,v){
                            if(v.status!==0){
                                var n=$.ccio.mon[v.mid];
                                if(n){v.title=n.name+' - '+(parseInt(v.size)/1000000).toFixed(2)+'mb';}
                                v.start=v.time;
                                v.filename=$.ccio.init('tf',v.time)+'.'+v.ext;
                                e.ar.push(v);
                            }
                        })
                            e.b.html('')
                            try{e.b.fullCalendar('destroy')}catch(er){}
                            e.b.fullCalendar({
                            header: {
                                left: 'prev,next today',
                                center: 'title',
                                right: 'month,agendaWeek,agendaDay,listWeek,listDay'
                            },
                            defaultDate: moment().format('YYYY-MM-DD'),
                            navLinks: true,
                            eventLimit: true,
                            events:e.ar,
                            eventClick:function(f){
                                $('#temp').html('<div mid="'+f.mid+'" ke="'+f.ke+'" file="'+f.filename+'"><div video="launch" href="'+f.href+'"></div></div>').find('[video="launch"]').click();
                                $(this).css('border-color', 'red');
                            }
                        });
                        setTimeout(function(){e.b.fullCalendar('changeView','listDay');},500)
                    break;
                    case'videos_table':
                        e.t.attr('class','fa fa-film')
                        e.o.show();
                        e.tmp='<table class="table table-striped" style="max-height:500px">';
                        e.tmp+='<thead>';
                        e.tmp+='<tr>';
                        e.tmp+='<th><div class="checkbox"><input id="videos_select_all" type="checkbox"><label for="videos_select_all"></label></div></th>';
                        e.tmp+='<th data-field="Closed" data-sortable="true">Closed</th>';
                        e.tmp+='<th data-field="Ended" data-sortable="true">Ended</th>';
                        e.tmp+='<th data-field="Started" data-sortable="true">Started</th>';
                        e.tmp+='<th data-field="Monitor" data-sortable="true">Monitor</th>';
                        e.tmp+='<th data-field="Filename" data-sortable="true">Filename</th>';
                        e.tmp+='<th data-field="Size" data-sortable="true">Size (mb)</th>';
                        e.tmp+='<th data-field="Watch" data-sortable="true">Watch</th>';
                        e.tmp+='<th data-field="Download" data-sortable="true">Download</th>';
                        e.tmp+='<th data-field="Delete" data-sortable="true">Delete</th>';
                        e.tmp+='</tr>';
                        e.tmp+='</thead>';
                        e.tmp+='<tbody>';
                        $.each(d,function(n,v){
                            if(v.status!==0){
                                v.start=v.time;
                                v.filename=$.ccio.init('tf',v.time)+'.'+v.ext;
                                e.tmp+='<tr data-ke="'+v.ke+'" data-status="'+v.status+'" data-mid="'+v.mid+'" data-file="'+v.filename+'">';
                                e.tmp+='<td><div class="checkbox"><input id="'+v.ke+'_'+v.filename+'" name="'+v.filename+'" value="'+v.mid+'" type="checkbox"><label for="'+v.ke+'_'+v.filename+'"></label></div></td>';
                                e.tmp+='<td><span class="livestamp" title="'+v.end+'"></span></td>';
                                e.tmp+='<td>'+v.end+'</td>';
                                e.tmp+='<td>'+v.time+'</td>';
                                e.tmp+='<td>'+v.mid+'</td>';
                                e.tmp+='<td>'+v.filename+'</td>';
                                e.tmp+='<td>'+(parseInt(v.size)/1000000).toFixed(2)+'</td>';
                                e.tmp+='<td><a class="btn btn-sm btn-primary" video="launch" href="'+v.href+'">&nbsp;<i class="fa fa-play-circle"></i>&nbsp;</a></td>';
                                e.tmp+='<td><a class="btn btn-sm btn-success" download="'+v.mid+'-'+v.filename+'" href="'+v.href+'">&nbsp;<i class="fa fa-download"></i>&nbsp;</a></td>';
                                e.tmp+='<td><a class="btn btn-sm btn-danger" video="delete">&nbsp;<i class="fa fa-trash"></i>&nbsp;</a></td>';
                                e.tmp+='</tr>';
                            }
                        })
                        e.tmp+='</tbody>';
                        e.tmp+='</table>';
                        e.b.html(e.tmp);delete(e.tmp)
                        $.ccio.init('ls');
                        $.vidview.e.find('table').bootstrapTable();
                    break;
                }
            })
        break;
        case'fullscreen':
            e.e=e.e.parents('.monitor_item');
            e.vid=e.e.find('.stream-element')[0]
            if (e.vid.requestFullscreen) {
              e.vid.requestFullscreen();
            } else if (e.vid.mozRequestFullScreen) {
              e.vid.mozRequestFullScreen();
            } else if (e.vid.webkitRequestFullscreen) {
              e.vid.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        break;
        case'bigify':
            e.m=$('#monitors_live')
            if(e.p.hasClass('selected')){e.m.find('.monitor_item').resize();return}
            $('.monitor_item .videos_list').remove();
            e.e=e.e.parents('.monitor_item');
            $('.videos_list.glM'+e.mid).clone().appendTo(e.e.find('.hud .videos_monitor_list')).find('h3').remove()
            if(!e.e.is(':first')){
                e.f=e.m.find('.monitor_item').first().insertAfter(e.e.prev())
                e.e.prependTo('#monitors_live');
                $('#main_canvas .scrollable').animate({scrollTop: $("#monitor_live_"+e.mid).position().top},1000);
//                $.ccio.cx({f:'monitor',ff:'watch_on',id:e.f.attr('mid')})
            }
            e.m.find('.monitor_item').resize();
            e.e=$('#files_recent .videos_list.glM'+e.mid);
            if(e.e.length>1){
                e.e.eq(2).remove();
            }
            $('video').each(function(n,v){if(v.paused){v.play()}})
        break;
        case'watch_on':
            $.ccio.cx({f:'monitor',ff:'watch_on',id:e.mid})
        break;
        case'control_toggle':
            e.e=e.p.find('.pad');
            if(e.e.length>0){e.e.remove()}else{e.p.append('<div class="pad"><div class="control top" monitor="control" control="up"></div><div class="control left" monitor="control" control="left"></div><div class="control right" monitor="control" control="right"></div><div class="control bottom" monitor="control" control="down"></div><div class="control middle" monitor="control" control="center"></div></div>')}
        break;
        case'watch':
            if($("#monitor_live_"+e.mid).length===0||$.ccio.mon[e.mid].watch!==1){
                $.ccio.cx({f:'monitor',ff:'watch_on',id:e.mid})
            }else{
//                $("#monitor_live_"+e.mid+' [monitor="bigify"]').click()
            }
        break;
        case'watch_off':
            $.ccio.cx({f:'monitor',ff:'watch_off',id:e.mid})
        break;
        case'delete':
            e.m=$('#confirm_window').modal('show');e.f=e.e.attr('file');
            $.confirm.title.text('Delete Monitor : '+e.mon.name)
            e.html='Do you want to delete this monitor? You cannot recover it.'
            e.html+='<table class="info-table"><tr>';
            $.each(e.mon,function(n,v,g){
                if(n==='host'&&v.indexOf('@')>-1){g=v.split('@')[1]}else{g=v};
                try{JSON.parse(g);return}catch(err){}
                e.html+='<tr><td>'+n+'</td><td>'+g+'</td></tr>';
            })
            e.html+='</tr></table>';
            $.confirm.body.html(e.html)
            $.confirm.click({title:'Delete Monitor',class:'btn-danger'},function(){
                $.ccio.cx({f:'monitor',ff:'delete',mid:e.mid,ke:e.ke});
            });
        break;
        case'edit':
            e.p=$('#add_monitor'),e.mt=e.p.attr('mid',e.mid).attr('ke',e.ke).find('.modal-title')
            if(!$.ccio.mon[e.mid]){
                //new monitor
                e.p.find('[monitor="delete"]').hide()
                e.mt.find('span').text('Add'),e.mt.find('i').attr('class','fa fa-plus');
                //default values
                e.values={
                    "mode":"stop",
                    "mid":$.ccio.gid(),
                    "name":"",
                    "protocol":"http",
                    "ext":"webm",
                    "type":"jpeg",
                    "host":"",
                    "path":"",
                    "port":"",
                    "fps":"1",
                    "width":"640",
                    "height":"480",
                    "details":JSON.stringify({
                            "detector_frame":"1",
                            "detector_mail":"0",
                            "fatal_max":"",
                            "muser":"",
                            "mpass":"",
                            "sfps":"1",
                            "aduration":"",
                            "detector":"0",
                            "detector_trigger":null,
                            "detector_save":null,
                            "detector_face":null,
                            "detector_fullbody":null,
                            "detector_car":null,
                            "detector_timeout":"",
                            "detector_fps":"",
                            "detector_scale_x":"",
                            "detector_scale_y":"",
                            "stream_type":"mjpeg",
                            "stream_vcodec":"libx264",
                            "stream_acodec":"",
                            "hls_time":"2",
                            "preset_stream":"ultrafast",
                            "hls_list_size":"3",
                            "signal_check":"10",
                            "signal_check_log":"0",
                            "stream_quality":"15",
                            "stream_fps":"",
                            "stream_scale_x":"",
                            "stream_scale_y":"",
                            "svf":"",
                            "vcodec":"copy",
                            "crf":"",
                            "preset_record":"",
                            "acodec":"libvorbis",
                            "timestamp":"0",
                            "dqf":"0",
                            "cutoff":"15",
                            "vf":"",
                            "control":"0",
                            "control_stop":"0",
                            "control_url_stop_timeout":"",
                            "control_url_center":"",
                            "control_url_left":"",
                            "control_url_left_stop":"",
                            "control_url_right":"",
                            "control_url_right_stop":"",
                            "control_url_up":"",
                            "control_url_up_stop":"",
                            "control_url_down":"",
                            "control_url_down_stop":"",
                            "cust_input":"",
                            "cust_detect":"",
                            "cust_stream":"",
                            "cust_record":"",
                            "custom_output":"",
                            "loglevel":"error",
                            "sqllog":"0"
                        }),
                    "shto":"[]",
                    "shfr":"[]"
                }
                e.mt.find('.edit_id').text(e.values.mid);
            }else{
                //edit monitor
                e.p.find('[monitor="delete"]').show()
                e.mt.find('.edit_id').text(e.mid);
                e.mt.find('span').text('Edit');
                e.mt.find('i').attr('class','fa fa-wrench');
                e.values=$.ccio.mon[e.mid];
            }
            $.each(e.values,function(n,v){
                $.aM.e.find('[name="'+n+'"]').val(v).change()
            })
            e.ss=JSON.parse(e.values.details);
            e.p.find('[detail]').each(function(n,v){
                v=$(v).attr('detail');if(!e.ss[v]){e.ss[v]=''}
            })
            $.each(e.ss,function(n,v){
                $.aM.e.find('[detail="'+n+'"]').val(v).change();
            })
            $('#add_monitor').modal('show')
                //temp
//                .find('[detail="timestamp"]').val('0').change()
        break;
    }
})

$('#video_viewer,#confirm_window').on('hidden.bs.modal',function(){
    $(this).find('video').remove();
});
$('body')
.on('resize','#monitors_live .monitor_item',function(e){
    e.e=$(this).find('.mdl-card__media');
    e.c=e.e.find('canvas');
    e.c.attr('height',e.e.height());
    e.c.attr('width',e.e.width());
})
.on('keyup','.search-parent .search-controller',function(){
    _this = this;
    $.each($(".search-parent .search-body .search-row"), function() {
        if($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
           $(this).hide();
        else
           $(this).show();
    });
}); 

////
$(document).ready(function(e){
    e.o=$.ccio.op().class_toggle;
    if(e.o){
        $.each(e.o,function(n,v){
            if(v[1]===1){
                $(n).addClass(v[0])
            }else{
                $(n).removeClass(v[0])
            }
        })
    }
})