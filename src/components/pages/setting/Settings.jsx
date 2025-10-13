import React from 'react'
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';

function Settings() {
  return (
    <div className='w-[100%] h-[100%] justify-center items-center flex flex-col bg-[#ECEFF2] text-[#BCC7D2]'>
      <ConstructionRoundedIcon sx={{color:'#BCC7D2', fontSize:'4rem'}} />
      <h1 className='text-2xl font-bold'>
        Under Development
      </h1 >
    </div>
  )
}

export default Settings