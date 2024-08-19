import CustomButton from "~/components/ui/CustomButton"
import CustomDropDown from "~/components/ui/CustomDropDown"
import CustomInput from "~/components/ui/CustomInput"
import CustomPasswordInput from "~/components/ui/CustomPasswordInput"

const Try = () => {
    return (
        <div>
            <CustomUser
                name="John Doe"
                email="john.doe@example.com"
                avatarSrc="https://i.pravatar.cc/150?u=custom-avatar"
            />
        </div>
    )
}

export default Try 