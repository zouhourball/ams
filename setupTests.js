/* eslint-disable jest/require-hook */
import 'babel-polyfill'
import Adapter from 'enzyme-adapter-react-16'
import { configure } from 'enzyme'

configure({ adapter: new Adapter() })
