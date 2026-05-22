const API =
process.env
.NEXT_PUBLIC_API_URL;

export async function api(
endpoint,
options={}
){

const res =
await fetch(
`${API}${endpoint}`,
{
credentials:
"include",

headers:{
"Content-Type":
"application/json",

...(options.headers||{})
},

...options,
}
);

if(
!res.ok
){

let err={};

try{
err=
await res.json();
}catch{}

throw new Error(
err.message ||
"Request failed"
);

}

return res.json();

}

export default api;
