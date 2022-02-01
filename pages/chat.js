import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from "../src/components/ButtonSendSticker.js";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQwNDY2OCwiZXhwIjoxOTU4OTgwNjY4fQ.8pEOUA0W8AuO_rg-mWkarzxvAfM5uPNi2dc9i2266Z4";
const SUPABASE_URL = "https://iwisxdwdiwfxpjpbfhfn.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagemEmTempoReal(adicionaMensagem) {
   return supabaseClient
      .from("mensagens")
      .on("INSERT", (respostaLive) => {
         adicionaMensagem(respostaLive.new)
      })
      .subscribe(); 
}

export default function ChatPage() {
   const roteamento = useRouter();
   const usuarioLogado = roteamento.query.username;
   const [mensagem, setMensagem] = useState("");
   const [listaDeMensagens, setListaDeMensagens] = useState([]);

   useEffect(() => {
      supabaseClient
         .from("mensagens")
         .select("*")
         .order("id", { ascending: false })
         .then(({ data }) => {
            console.log("Dados do Supabase: ", data)
            setListaDeMensagens(data);
         })
         escutaMensagemEmTempoReal((novaMensagem) => {
            console.log("Nova mensagemm", novaMensagem)
            setListaDeMensagens((valorAtualDaLista) => {
               return [novaMensagem, ...valorAtualDaLista]
            });
         });
   }, [])

   function handleNovaMensagem(novaMensagem) {
      const mensagem = {
         // id: listaDeMensagens.length + 1,
         de: usuarioLogado,
         texto: novaMensagem
      }
      supabaseClient
         .from("mensagens")
         .insert([
            mensagem
         ])
         .then(({ data }) => {
            console.log("Criando mensagem: ", data)
         })

      setMensagem("");
   }

   return (
      <Box
         styleSheet={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: appConfig.theme.colors.primary[500],
            backgroundImage: `url(https://eskipaper.com/images/gaming-wallpaper-5.jpg)`,
            backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
            color: appConfig.theme.colors.neutrals['000']
         }}
      >
         <Box
            styleSheet={{
               display: 'flex',
               flexDirection: 'column',
               flex: 1,
               boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
               borderRadius: '5px',
               backgroundColor: appConfig.theme.colors.neutrals[700],
               height: '100%',
               maxWidth: '95%',
               maxHeight: '95vh',
               padding: '32px',
            }}
         >
            <Header />
            <Box
               styleSheet={{
                  position: 'relative',
                  display: 'flex',
                  flex: 1,
                  height: '80%',
                  backgroundColor: appConfig.theme.colors.neutrals[600],
                  flexDirection: 'column',
                  borderRadius: '5px',
                  padding: '16px',
               }}
            >

               <MessageList mensagens={listaDeMensagens} />
               {/* {listaDeMensagens.map((mensagemAtual) => {
                  return (
                     <li key={mensagemAtual.id}>
                        {mensagemAtual.de}: {mensagemAtual.texto}
                     </li>
                  )
               })} */}

               <Box
                  as="form"
                  styleSheet={{
                     display: 'flex',
                     alignItems: 'center',
                  }}
               >
                  <TextField
                     value={mensagem}
                     onChange={(e) => {
                        setMensagem(e.target.value)
                     }}
                     onKeyPress={(e) => {
                        if (e.key === "Enter") {
                           e.preventDefault();
                           handleNovaMensagem(mensagem);
                        }
                     }}
                     placeholder="Insira sua mensagem aqui..."
                     type="textarea"
                     styleSheet={{
                        width: '100%',
                        border: '0',
                        resize: 'none',
                        borderRadius: '5px',
                        padding: '6px 8px',
                        backgroundColor: appConfig.theme.colors.neutrals[800],
                        marginRight: '12px',
                        color: appConfig.theme.colors.neutrals[200],
                     }}
                  />

                  <ButtonSendSticker
                     onStickerClick={(sticker) => {
                        // console.log("usando o componente: salva esse sticker no banco", sticker);
                        handleNovaMensagem(`:sticker: ${sticker}`)
                     }}
                  />

                  <Button
                     label='Enviar'
                     size='lg'
                     type='submit'
                     onClick={(e) => {
                        e.preventDefault();
                        handleNovaMensagem(mensagem);
                     }}
                     styleSheet={{
                        width: "10%",
                        height: "83%",
                        marginBottom: "7px"
                     }}
                     buttonColors={{
                        contrastColor: appConfig.theme.colors.neutrals["000"],
                        mainColor: appConfig.theme.colors.primary[500],
                        mainColorLight: appConfig.theme.colors.primary[400],
                        mainColorStrong: appConfig.theme.colors.primary[600],
                     }}
                  >
                  </Button>
               </Box>
            </Box>
         </Box>
      </Box>
   )
}

function Header() {
   return (
      <>
         <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
            <Text variant='heading5'>
               Chat
            </Text>
            <Button
               variant='tertiary'
               colorVariant='neutral'
               label='Logout'
               href="/"
            />
         </Box>
      </>
   )
}

function MessageList(props) {
   return (
      <Box
         tag="ul"
         styleSheet={{
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column-reverse',
            flex: 1,
            color: appConfig.theme.colors.neutrals["000"],
            marginBottom: '16px',
         }}
      >
         {props.mensagens.map((mensagem) => {
            return (
               <Text
                  key={mensagem.id}
                  tag="li"
                  styleSheet={{
                     borderRadius: '5px',
                     padding: '6px',
                     marginBottom: '12px',
                     hover: {
                        backgroundColor: appConfig.theme.colors.neutrals[700],
                     }
                  }}
               >
                  <Box
                     styleSheet={{
                        marginBottom: '8px',
                     }}
                  >
                     <Image
                        styleSheet={{
                           width: '20px',
                           height: '20px',
                           borderRadius: '50%',
                           display: 'inline-block',
                           marginRight: '8px',
                        }}
                        src={`https://github.com/${mensagem.de}.png`}
                     />
                     <Text tag="strong">
                        {mensagem.de}
                     </Text>
                     <Text
                        styleSheet={{
                           fontSize: '10px',
                           marginLeft: '8px',
                           color: appConfig.theme.colors.neutrals[300],
                        }}
                        tag="span"
                     >
                        {(new Date().toLocaleDateString())}
                     </Text>
                  </Box>
                  {mensagem.texto.startsWith(":sticker:")
                  ? (
                     <Image src={mensagem.texto.replace(":sticker:", "")} />
                  ) 
                  : (
                     mensagem.texto
                  )}
                  {/* {mensagem.texto} */}
               </Text>
            )
         })}


      </Box>
   )
}