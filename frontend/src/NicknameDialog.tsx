import { Box, Dialog, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

interface Props {
    open: boolean,
    setOpenDialog: Function,
    nickname: string,
    setNickname: (name: string) => void
}

export default function NicknameDialog({ open, setOpenDialog, nickname, setNickname }: Props) {
    const onEnterPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key == 'Enter') {
            setOpenDialog();
        }
    }

    return (
        <Dialog open={open} maxWidth='md'>
            <Box sx={{padding: 2}}>
                <DialogTitle>Please, set your nickname</DialogTitle>
                <DialogContent>
                    <Box marginTop='auto' display='flex' alignItems='center' gap={2}>
                        <TextField variant='standard' value={nickname} onChange={(e) => {setNickname(e.currentTarget.value)}} onKeyUp={onEnterPress} />
                        <IconButton onClick={() => {setOpenDialog()}}>
                            <SendIcon/>
                        </IconButton>
                    </Box>
                </DialogContent>
            </Box>
        </Dialog>
    )
}