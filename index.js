import React from "react";

import "./index.scss";

class FocusImg extends React.Component {
  state = {
    timer: null,
    imgContainer: null,
    imgItems: null,
    currentIndex: 0,
    indicatorContainer: null,
    indicatorItems: null,
  }
  componentDidMount() {
    this.setState(
      {
        imgItems: [...this.state.imgContainer.querySelectorAll('li')],
        indicatorItems: [...this.state.indicatorContainer.querySelectorAll('li')],
      },
      () => {
        this.setIndicatorAcitve(this.state.currentIndex);
      }
    );
    this.runTimer();

  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }
  runTimer = (currentIndex = 0) => {
    const timer = setInterval(() => {
      currentIndex = currentIndex === this.props.totalImgCount - 1 ? 0 : currentIndex + 1;
      this.imgContainerMove(currentIndex);
      this.setIndicatorAcitve(currentIndex);
      this.setState({ currentIndex });
    }, this.props.speed);

    this.setState({
      timer: timer,
    });
  }
  imgContainerMove = (targetIndex) => {
    this.state.imgContainer.style.transform = `translateX(${-this.props.imgWidth * targetIndex}px)`;
  }
  HandleIndicatorClick = (e) => {
    if (e.target.tagName !== 'LI') {
      return false;
    }
    clearInterval(this.state.timer);
    let index = this.getItemIndexInParent(this.state.indicatorContainer, 'li', e);
    this.imgContainerMove(index);
    this.setIndicatorAcitve(index);
    this.setState({
      currentIndex: index,
    });
    this.runTimer(index);
  }
  handleMouseEnter = (e) => {
    setTimeout(() => {
      clearInterval(this.state.timer);
    }, 0);
  }
  handleMouseLeave = () => {
    this.runTimer(this.state.currentIndex);
  }

  handleArrowClick = (e) => {
    let targetIndex = 0;
    if (/left/.test(e.target.className)) {
      if (this.props.loop) {
        targetIndex = this.state.currentIndex - 1 < 0 ? this.props.totalImgCount - 1 : this.state.currentIndex - 1;//loop
      } else {
        targetIndex = this.state.currentIndex - 1 < 0 ? 0 : this.state.currentIndex - 1;//no-loop
      }
    } else {
      if (this.props.loop) {
        targetIndex = this.state.currentIndex + 1 >= this.props.totalImgCount ? 0 : this.state.currentIndex + 1;//loop
      } else {
        targetIndex = this.state.currentIndex + 1 >= this.props.totalImgCount ? this.props.totalImgCount - 1 : this.state.currentIndex + 1;//no-loop
      }
    }
    this.imgContainerMove(targetIndex);
    this.setIndicatorAcitve(targetIndex);
    this.setState({
      currentIndex: targetIndex,
    });
  }
  setIndicatorAcitve = (currentIndex = 0, indicatorItems = this.state.indicatorItems) => {
    const thisOneWillDeactive = indicatorItems.find((el) => {
      return el.classList.contains('active');
    });
    if (thisOneWillDeactive) {
      thisOneWillDeactive.classList.remove('active');
    }
    indicatorItems[currentIndex].classList.add('active');
  }

  /**
   * 工具函数----使用场景：在一个事件委托中，找出目标元素在父元素中的下标。
   * @static 轮播图组件FocusImg的静态函数 / 类的函数
   * @param {Element} parentElement 父元素
   * @param {String} tagName 目标元素标签名，小写~
   * @param {Event} e 事件对象
   * @returns {Number} 数字，目标元素在父元素中的下标
   */
  getItemIndexInParent = (parentElement, tagName, e) => {
    const _children = [...parentElement.querySelectorAll(tagName)];
    for (let el = e.target; el !== e.currentTarget; el = el.parentElement) {
      if (el.tagName.toLowerCase() === tagName) {
        return _children.findIndex((item) => item === el);
      }
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <section className='banner_foucsImg'>
        <ul className='foucsImg_container' ref={(ul) => { this.state.imgContainer = ul }}
          onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}
        >
          {
            this.props.imgSource.map((item) => {
              return (
                <li className='foucsImg_item' key={item}>
                  <a href='' target='_blank' className='foucsImg_link'><img src={item} className='banner_img' /></a>
                </li>
              );
            })
          }
        </ul>
        <ul className='foucsImg_indicator' onClick={this.HandleIndicatorClick} ref={(ul) => { this.state.indicatorContainer = ul }}>
          {
            (() => {
              const result = [];
              for (let i = 0; i < this.props.totalImgCount; i++) {
                result.push(<li className='indicator_item' key={Math.random()}></li>);
              }
              return result;
            })()
          }
        </ul>
        <div className='arrow_left switchControl' onClick={this.handleArrowClick} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>&lt;</div>
        <div className='arrow_right switchControl' onClick={this.handleArrowClick} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>&gt;</div>
      </section>
    );
  }
}

export { FocusImg };