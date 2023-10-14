import Command from '@component/Command'
import PagesTitle from '@component/PagesTitle'
import { utilityCommands } from '@script/commands'

const Utility = () => (
  <>
    <PagesTitle
      data={{
        name: 'Utility',
        module: 'utility'
      }}
    />
    {utilityCommands.map((command, index) => (
      <Command key={index} name={command} />
    ))}
  </>
)
export default Utility
