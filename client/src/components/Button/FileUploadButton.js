import React from "react";
function FileUploadButton({handleOnChange}) {
  return (
   	<div>
		<input type="file" id={"profilePhoto"} name="pic" accept="image/*" onChange={handleOnChange}/>
    </div>
  )
}

export default FileUploadButton;
