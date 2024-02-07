import Settings from "./Settings"
import ModelSelect from "./ModelSelect"
import ToggleVariant from "./ToggleVariant";


function Header() {
    return (
        <header className="bg-background p-2   px-4 flex items-center shadow-md  justify-between">
            <Settings  />
            <ModelSelect  />
            <ToggleVariant/>
        </header>)
}

export default Header