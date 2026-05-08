import { useState } from "react";
type SkillCardProps = {
    name: string
}

const SkillCard = ({name}: SkillCardProps) => {
   const [like, setLike] = useState('');
    return ( 
    <article>
    Skill Card
    </article>

     );
}
 
export default SkillCard;