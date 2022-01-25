import { Box } from "@skynexui/components"

export default function Page404() {
   return (
      <>
         <Box 
            styleSheet={{
               backgroundImage: "url(https://http.cat/404)",
               backgroundColor: "black",
               backgroundPosition: "center",
               backgroundRepeat: 'no-repeat', 
            }}
         />
      </>
   )
}