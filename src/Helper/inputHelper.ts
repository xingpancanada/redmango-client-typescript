import React from 'react'

function inputHelper(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, data: any) {
  const tempData: any = {...data};
  tempData[event.target.name] = event.target.value;
  return tempData;
}

export default inputHelper