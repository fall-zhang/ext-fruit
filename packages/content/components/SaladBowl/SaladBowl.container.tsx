import {
  connect,
  MapStateToProps,
  MapDispatchToProps
} from 'react-redux'

import { StoreState, StoreAction } from '@/content/redux/modules'
import { SaladBowlPortal, SaladBowlPortalProps } from './SaladBowl.portal'


const mapStateToProps: MapStateToProps<
  StoreState,
  SaladBowlPortalProps,
  any
> = (state) => ({
  show: state.isShowBowl,
  panelCSS: state.config.panelCSS,
  x: state.bowlCoord.x,
  y: state.bowlCoord.y,
  withAnimation: state.config.animation,
  enableHover: state.config.bowlHover
})

const mapDispatchToProps: MapDispatchToProps<
  StoreAction,
  SaladBowlPortalProps,
  Dispatchers
> = dispatch => ({
  onActive: () => {
    dispatch({ type: 'BOWL_ACTIVATED' })
  }
})

export const SaladBowlContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SaladBowlPortal)

export default SaladBowlContainer
