import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sync } from '../actions/data'
import styles from '../styles/app.css'

function handleClick (event) {
  const id = event.target.dataset.id
  chrome.storage.sync.get(items => {
    const arr = Array.from(Object.assign({}, items, { length: Object.keys(items).length }))
    arr.splice(id, 1)
    const next = Object.assign({}, arr)
    chrome.storage.sync.clear(() => {
      chrome.storage.sync.set(next)
    })
  })
}

function handleRemove (event) {
  handleClick(event)
}

class App extends Component {
  componentWillMount () {
    chrome.storage.sync.get(items => {
      this.props.sync(Array.from(Object.assign({}, items, { length: Object.keys(items).length })))
    })
  }

  componentDidMount () {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      chrome.storage.sync.get(items => {
        this.props.sync(Array.from(Object.assign({}, items, { length: Object.keys(items).length })))
      })
    })
  }

  render () {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            <span className={styles.name}>TabMane</span>
            <span className={styles.info}>is tabs manager: synchronize between multiple browsers</span>
          </div>
          <div className={styles.icons}>
            <a className={styles.icon} href='https://github.com/ymkz/TabMane' target='_blank'><i className='fa fa-fw fa-github' aria-hidden='true' /></a>
          </div>
        </div>
        <div className={styles.components}>
          {this.props.data.map((item, index) => (
            <div className={styles.tab} key={index}>
              <div className={styles.remove}><i className='zmdi zmdi-close' data-id={index} onClick={handleRemove} /></div>
              <img className={styles.favicon} src={item.favIconUrl} />
              <a className={styles.link} href={item.url} target='_blank' data-id={index} onClick={handleClick}>{item.title}</a>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return state
}

function mapDispatchToProps (dispatch) {
  return {
    sync (data) {
      dispatch(sync(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

// <a className={styles.icon} href={chrome.runtime.getURL('option.html')} target='_blank'><i className='fa fa-fw fa-cog' aria-hidden='true' /></a>
