import MakerExperienceSkills from './experience/skills';
import MakerExperienceLanguages from './experience/languages';
import MakerExperienceInterest from './experience/interest';
import MakerExperienceOther from './experience/others';
import MakerExperienceCustom from './experience/custom';
  

export default function MakerExperience() {
    return (
        <div className='flex flex-col gap-4'>
            <div className='p-2 rounded border-dashed border-2'>
                <MakerExperienceSkills />
            </div>
            <div className='p-2 rounded border-dashed border-2'>
                <MakerExperienceLanguages />
            </div>
            <div className='p-2 rounded border-dashed border-2'>
                <MakerExperienceOther />
            </div>
            <div className='p-2 rounded border-dashed border-2'>
                <MakerExperienceCustom />
            </div>
        </div>
    )
}