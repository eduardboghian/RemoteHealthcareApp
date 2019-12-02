import React from 'react'
import '../Profile/Profile.css'

export default function Avatar(path) {
    const newPath = path.path.replace(/^'(.*)'$/, '$1')


    return (
        <div className='avatar'>
            <img src={`/${newPath}`} alt=""/>
        </div>
    )
}
                                        