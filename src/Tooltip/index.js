import { Component, PropTypes, cloneElement } from 'react'
import { findDOMNode } from 'react-dom'
import { objectAssign } from '../utils/objects'
import PureRender from '../mixins/PureRender'
import * as Tip from './tip'
import * as Popover from './popover'

class Tooltip extends Component {
  constructor (props) {
    super(props)

    this.handleShow = this.handleShow.bind(this)
  }

  handleShow () {
    const { content, position } = this.props

    const el = findDOMNode(this)
    const rect = el.getBoundingClientRect()
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft

    let left, top

    switch (position) {
      case 'top-left':
        left = scrollLeft + rect.left
        top = scrollTop + rect.top
        break
      case 'top':
        left = scrollLeft + rect.left + (rect.width / 2)
        top = scrollTop + rect.top
        break
      case 'top-right':
        left = scrollLeft + rect.left + rect.width
        top = scrollTop + rect.top
        break
      case 'left':
        left = scrollLeft + rect.left
        top = scrollTop + rect.top + (rect.height / 2)
        break
      case 'right':
        left = scrollLeft + rect.left + rect.width
        top = scrollTop + rect.top + (rect.height / 2)
        break
      case 'bottom-left':
        left = scrollLeft + rect.left
        top = scrollTop + rect.top + rect.height
        break
      case 'bottom':
        left = scrollLeft + rect.left + (rect.width / 2)
        top = scrollTop + rect.top + rect.height
        break
      case 'bottom-right':
        left = scrollLeft + rect.left + rect.width
        top = scrollTop + rect.top + rect.height
        break
    }

    const props = objectAssign({}, this.props, { style: { left: left + 'px', top: top + 'px' } })

    content ? Popover.show(props) : Tip.show(props)
  }

  render () {
    const { children, content, trigger } = this.props
    const props = {}

    if (trigger === 'hover') {
      props.onMouseEnter = this.handleShow
      props.onMouseLeave = content ? Popover.hide : Tip.hide
    } else {
      props.onClick = () => {
        setTimeout(this.handleShow, 10)
      }
    }

    return cloneElement(children, props)
  }
}

Tooltip.defaultProps = {
  position: 'top',
  trigger: 'hover'
}

Tooltip.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
  content: PropTypes.element,
  position: PropTypes.oneOf(['top-left', 'top', 'top-right', 'left', 'right', 'bottom-left', 'bottom', 'bottom-right']),
  tip: PropTypes.string,
  trigger: PropTypes.oneOf(['click', 'hover'])
}

export default PureRender(false)(Tooltip)
