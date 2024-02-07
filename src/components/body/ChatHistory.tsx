import { Drawer } from 'vaul';

function ChatHistory() {
    return (
        <Drawer.Root >
            <Drawer.Trigger></Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Content>
                    <p className='h-[200px]'>Content</p>
                </Drawer.Content>
                <Drawer.Overlay />
            </Drawer.Portal>
        </Drawer.Root>
    )
}
export default ChatHistory