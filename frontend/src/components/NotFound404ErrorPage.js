import React from 'react'

const NotFound404ErrorPage = () => {
  return (
    <div className='not-found-container'>
      <h4>This page isn't available</h4>
      <div style={{paddingBottom: '24px'}}>The link maybe broken, or the page may have been removed. Check to see if the link you're trying to open is correct</div >
      <div style={{paddingBottom: '12px'}}>
        <a className='btn btn-primary btn-block' href='/'>Go to HomePage</a>  
      </div>
      <a className='_s65ijh7' href='/contact'>Direct to support team</a>
    </div> 
  )
}

export default NotFound404ErrorPage