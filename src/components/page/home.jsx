import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as calc from '../../store/actions/index.js'
import { bindActionCreators } from 'redux'
import { InputNumber, Button, Checkbox } from 'antd'
import '../../assets/home.css'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      originUnitPrice: [0, 0, 0],
      selectedPrice: [0, 0, 0],
      discountPrice: [],
      totalPrice: '',
      inputValue: [],
      isClick: [1, 1, 1],
      isClickBox: false
    }
  }
  inputNumber (idx, value) {
    let arr = [...this.state.originUnitPrice]
    arr.splice(idx, 1, value)
    this.setState(() => ({
      originUnitPrice: arr
    }))
    if (this.state.isClick[idx]) {
      let arr2 = [...this.state.selectedPrice]
      arr2.splice(idx, 1, value)
      this.setState(() => ({
        selectedPrice: arr2
      }))
    }
  }
  add () {
    console.log(this.state.isClick)
    let arr = [...this.state.originUnitPrice]
    let arr2 = [...this.state.selectedPrice]
    let arr3 = [...this.state.isClick]
    arr.push(0)
    arr2.push(0)
    arr3.push(1)
    this.setState({
      originUnitPrice: [...arr],
      discountPrice: [],
      selectedPrice: [...arr2],
      isClick: arr3
    })
  }
  minus () {
    let arr = [...this.state.originUnitPrice]
    let arr2 = [...this.state.selectedPrice]
    arr.pop()
    arr2.pop()
    this.setState({
      originUnitPrice: [...arr],
      discountPrice: [],
      selectedPrice: arr2,
      isClick: arr2
    })
  }
  inputBlur (ele) {
  }
  caculate () {
    console.log(this.state.selectedPrice)
    if (!this.state.isClickBox) {
      this.setState({
        selectedPrice: [...this.state.originUnitPrice]
      }, () => {
        this.cal()
      })
    } else {
      if (this.state.selectedPrice.length === 0 || this.state.totalPrice === '') return
      this.cal()
    }
    
  }
  cal () {
    let arr = []
    let temp = this.state.selectedPrice
    let total = 0
    for (let i = 0; i < temp.length; i++) {
      total += temp[i]
    }
    if (total) {
      arr = temp.map(ele => {
        if (typeof ele !== 'number') return
        return ((ele / total * this.state.totalPrice).toFixed(2))
      })
      this.setState({
        discountPrice: [...arr]
      })
    } else {
      alert('请输入至少一个单价')
    }
  }
  inputTotalPrice (value) {
    this.setState({
      totalPrice: value
    })
    console.log(this.state.totalPrice)
  }
  checkBoxChange (ele, index, e) {
    function getSelectedPrice (self) {
      let arr = [...self.state.originUnitPrice]
      let arr2 = [...self.state.selectedPrice]
      let arr3 = arr2.map(ele => {
        return 1
      })
      let temp = 0
      if (e.target.checked) {
        temp = Number(arr.splice(index, 1, self.state.originUnitPrice[index]).join(''))
        arr2.splice(index, 1, temp)
        arr3.splice(index, 1, 1)
      } else {
        arr2.splice(index, 1, 0)
        arr3.splice(index, 1, 0)
      }
      console.log(arr2)
      self.setState({
        selectedPrice: arr2,
        isClick: arr3
      }, () => {
        // console.log(self.state.selectedPrice)
      })
    }
    if (!this.state.isClickBox) {
      this.setState({
        isClickBox: true
      }, () => {
        getSelectedPrice(this)
      })
    } else {
      getSelectedPrice(this)
    }
  }
  componentDidMount () {
  }
  render () {
    return (
      <div>
          <Button type="primary" loading={this.state.loading} onClick={this.add.bind(this)}>添加</Button>
          <Button type="default" loading={this.state.loading} onClick={this.minus.bind(this)}>减少</Button>
          <div>
            <Checkbox disabled></Checkbox>
            <span className="label-name-self">成交价</span>
            <InputNumber onChange={this.inputTotalPrice.bind(this)} value={this.state.totalPrice} size="large"/>
          </div>
          <div className="input-box">
            {
              this.state.originUnitPrice.map((ele, index) => {
                return (<div key={index}>
                          <div>
                            <Checkbox onChange={this.checkBoxChange.bind(this, ele, index)} defaultChecked></Checkbox>
                            <span className="label-name-self">{index + 1}</span>
                            <InputNumber onChange={this.inputNumber.bind(this, index)} size="large" value={ele} onBlur={this.inputBlur.bind(this, ele)}/>
                          </div>
                        </div>)
              })
            }
          <Button type="danger" loading={this.state.loading} onClick={this.caculate.bind(this)}>计算</Button>
          </div>
          <div className="show-box">
            {
              this.state.discountPrice.map((ele, index) => {
                return (<div key={Math.random()}>{this.state.discountPrice.length !== 0 && this.state.discountPrice[index]}</div>)
              })
            }
          </div>
      </div>
    )
  }
}

// 添加到state
function mapStateToProps(state) {
    return {
        name: state.userInfo.name,
        age: state.userInfo.age
    }
}

function mapDispatchToProps(dispatch) {
    return {
//      calcAge: () => { dispatch({type: 'CALCAGE'}) }
        ...bindActionCreators(calc, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)
