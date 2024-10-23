import useDarkMode from "use-dark-mode";
import Moon from '../icons/Moon'
import Sun from '../icons/Sun'

export const ThemeSwitcher = () => {
  const darkMode = useDarkMode(false);

  return (
      <button className="py-3" onClick={darkMode.value ? darkMode.disable : darkMode.enable}>
        {darkMode.value ? <Sun style={{ color: 'yellow' }} /> : <Moon style={{ color: 'black' }} />}
      </button>
  )
};

export default ThemeSwitcher;