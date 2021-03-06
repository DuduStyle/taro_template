// 占位 不会被编译 只是为了ts检查不报错
/**
  * 地图组件
  */

import { ComponentClass, Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Picker, Button } from '@tarojs/components'
import { AtModal, AtModalContent } from 'taro-ui'

import { BaseComponent, Modal } from '~/components'
import { loadScriptSync } from '~/utils/index'

import './../../../node_modules/taro-ui/dist/style/components/modal.scss'
import './HDMap.scss'

/**
 * props属性
 */
interface IProps {
  /**
   * 子元素
   */
  children?: any;
  /**
   * 地图类型
   */
  type?: 'normal' | 'webgl';
  /**
   * 地图容器id
   */
  mapContainerId: string;
  /**
   * 地图中心点
   */
  center: {
    /**
     * 纬度
     */
    latitude: number;
    /**
     * 经度
     */
    longitude: number;
  },
  markers: Array<{
    position: {
      latitude: number;
      longitude: number;
    }
    properties: any;
  }>
  onMarkerClick: ()=>void
}

/**
 * 组件内部属性
 */
interface IState {

}

interface CMap {
  props: IProps;
  state: IState;
}

class CMap extends BaseComponent {

  constructor(props) {
    super(props)
    this.state = {
      timeSel: '12:01',
    }
  }

  static defaultProps: IProps = {
    mapContainerId: 'mapContainer',
    center: {
      latitude:  28.207326,
      longitude: 112.882385,
    },
    markers: [
      {
        position: {
          latitude: 28.207326,
          longitude: 112.882385
        },
        properties: {
          title: "marker1"
        }
      },
    ],
    onMarkerClick: ()=>{}
  }

  onTimeChange = e => {
    this.setState({
      timeSel: e.detail.value
    })
  }

  componentDidMount() {
    console.log('into didmount')
    const { type } = this.props
    this.loadGLMap()
  }

  loadNormalMap() {

    loadScriptSync('qqMap', () => {

      var center = new qq.maps.LatLng(28.207326, 112.882385);
      var map = new qq.maps.Map(document.getElementById("container"), {
        center: center,
        zoom: 16
      });


      const createMarker = (position: {
        longitude: number;
        latitude: number;
        title: string;
      }) => {

        //创建一个Marker
        var marker = new qq.maps.Marker({
          //设置Marker的位置坐标
          position: new qq.maps.LatLng(position.latitude, position.longitude),
          //设置显示Marker的地图
          map: map
        });

        //设置Marker的可见性，为true时可见,false时不可见，默认属性为true
        marker.setVisible(true);
        //设置Marker的动画属性为从落下
        // marker.setAnimation(qq.maps.MarkerAnimation.DOWN);
        //设置Marker是否可以被拖拽，为true时可拖拽，false时不可拖拽，默认属性为false
        marker.setDraggable(true);
        ////设置Marker自定义图标的属性，size是图标尺寸，该尺寸为显示图标的实际尺寸，origin是切图坐标，该坐标是相对于图片左上角默认为（0,0）的相对像素坐标，anchor是锚点坐标，描述经纬度点对应图标中的位置
        var anchor = new qq.maps.Point(0, 0),
          size = new qq.maps.Size(60, 60),
          origin = new qq.maps.Point(60, 60),
          icon = new qq.maps.MarkerImage(
            require('./../../assets/images/icon/icon_tabbar_home_selected.png'),
            size,
            origin,
            anchor
          );
        marker.setIcon(icon);
        //设置Marker阴影图片属性，size是图标尺寸，该尺寸为显示图标的实际尺寸，origin是切图坐标，该坐标是相对于图片左上角默认为（0,0）的相对像素坐标，anchor是锚点坐标，描述经纬度点对应图标中的位置
        var anchorb = new qq.maps.Point(0, 0),
          sizeb = new qq.maps.Size(60, 60),
          origin = new qq.maps.Point(0, 0),
          iconb = new qq.maps.MarkerImage(
            require('./../../assets/images/icon/icon_tabbar_home_selected.png'),
            sizeb,
            origin,
            anchorb
          );
        marker.setShadow(iconb);
        //设置标注的名称，当鼠标划过Marker时显示
        marker.setTitle(position.title || '测试');


        //标记Marker点击事件
        qq.maps.event.addListener(marker, 'click', function (e) {
          console.log('e', e)
          alert(e.target.title)
        });
      }



      createMarker({
        longitude: 112.882385,
        latitude: 28.207326,
        title: '测试1'
      })
      createMarker({
        longitude: 112.88385,
        latitude: 28.207326,
        title: '测试2'
      })
      createMarker({
        longitude: 112.88485,
        latitude: 28.206326,
        title: '测试3'
      })

    })
  }

  // 加载webgl地图
  loadGLMap() {
    const { mapContainerId, markers } = this.props
    console.log('into')
    loadScriptSync('tMap', () => {
      console.log('into loadScriptSync then')

      var center = new TMap.LatLng(28.207326, 112.882385);//设置中心点坐标
      //初始化地图
      var map = new TMap.Map(mapContainerId, {
        center: center,
        zoom: 16
      });

      let tempList: Array<any> = []
      markers.forEach((item,index)=>{
        console.log(item.position.latitude)
        console.log(item.position.longitude)
        tempList.push({
          id: 'demo',
          styleId: 'marker',
          position: new TMap.LatLng(item.position.latitude, item.position.longitude),
          properties: item.properties
        })
      })

      const geometries = tempList

      // 初始化marker
      var marker = new TMap.MultiMarker({
        id: 'marker-layer',
        map: map,
        styles: {
          "marker": new TMap.MarkerStyle({
            "width": 25,
            "height": 35,
            "anchor": { x: 16, y: 32 },
            "src": require('./../../assets/images/icon/icon_tabbar_home_selected.png')
          })
        },
        geometries: geometries
      });

      //监听回调函数（非匿名函数）
      var clickHandler = this.props.onMarkerClick
      // function (evt) {
      //   alert(evt.geometry.properties.title)
      // }
      //监听marker点击事件
      marker.on("click", clickHandler)

      //解绑点击事件，要求事件处理方法不能是匿名方法
      function eventOff() {
        marker.off("click", clickHandler)
      }
    }).then((res) => {

    })


  }

  render() {
    const { type, mapContainerId } = this.props
    return (
      <View className="Map-comp">
        {
          type === 'webgl' ?
            <View id={mapContainerId} style={{ width: Taro.pxTransform(750), height: Taro.pxTransform(600) }}></View>
            :
            <View id={mapContainerId} style={{ width: Taro.pxTransform(750), height: Taro.pxTransform(600) }}></View>
        }
      </View>
    )
  }
}

export default CMap as ComponentClass<IProps, IState>
