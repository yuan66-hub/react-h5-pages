/* eslint-disable */
import React, { FC } from 'react' // @ts-ignore
import vip from '@/assets/images/vip.png'
import './style.less'

const Page: FC = () => {
  return (
    <>
     <h1 className="home">Hello world!</h1>
     <img src={vip} alt="" className='vip' />
    </>
  )
}

export default Page
