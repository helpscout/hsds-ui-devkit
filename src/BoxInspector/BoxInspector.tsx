import * as React from 'react'
import {cx} from '../utils'
import styled from '@helpscout/fancy'

export interface Props {
  outline: string
  showOutlines: boolean
  targetSelector: string
}

export class BoxInspector extends React.Component<Props> {
  static defaultProps = {
    targetSelector: '*',
    outline: '1px solid red',
    showOutlines: true,
  }

  node: HTMLDivElement

  componentDidMount() {
    this.bindEvents()
  }

  componentWillUnmount() {
    this.unbindEvents()
  }

  componentDidUpdate() {
    this.unbindEvents()
    this.bindEvents()
    if (!this.props.showOutlines) {
      this.cleanUp()
    }
  }

  bindEvents = () => {
    if (!this.node) return
    if (!this.props.showOutlines) return

    Array.from(this.node.querySelectorAll(this.props.targetSelector)).forEach(
      node => {
        node.addEventListener('mouseenter', this.handleOnMouseEnter)
        node.addEventListener('mouseleave', this.handleOnMouseLeave)
      },
    )
  }

  unbindEvents = () => {
    if (!this.node) return

    Array.from(this.node.querySelectorAll(this.props.targetSelector)).forEach(
      node => {
        node.removeEventListener('mouseenter', this.handleOnMouseEnter)
        node.removeEventListener('mouseleave', this.handleOnMouseLeave)
      },
    )
  }

  cleanUp = () => {
    if (!this.node) return

    Array.from(this.node.querySelectorAll(this.props.targetSelector)).forEach(
      node => {
        if (node['style']) {
          node['style'].outline = null
        }
      },
    )
  }

  handleOnMouseEnter = event => {
    event.target.style.outline = this.props.outline
  }

  handleOnMouseLeave = event => {
    event.target.style.outline = 'none'
  }

  setNodeRef = node => (this.node = node)

  render() {
    return (
      <BoxInspectorUI
        innerRef={this.setNodeRef}
        className={cx('BoxInspector')}
        {...this.props}
      >
        {this.props.children}
      </BoxInspectorUI>
    )
  }
}

const BoxInspectorUI = styled('div')`
  ${({showOutlines}) =>
    showOutlines &&
    `
    * {
      pointer-events: auto !important;
    }

    [class*="${cx()}"],
    .${cx('Guide')} * {
      pointer-events: none !important;
    }
  `};
`

export default BoxInspector
