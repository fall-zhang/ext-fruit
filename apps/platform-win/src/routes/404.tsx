import { createFileRoute } from '@tanstack/react-router'
import './404.scss'

export const Route = createFileRoute('/404')({
  component: RouteComponent,
})

function RouteComponent () {
  return <div className='container_404'>
    <div className="card">
      <div className="orb orb--1" />
      <div className="orb orb--2" />
      <div className="orb orb--3" />
      <div className="orb orb--4" />
      <div className="error-container">
        <div className="error-code">404</div>
        <div className="error-msg">Nothing to see here.</div>
        <a href="/" className="home-btn">Go Home</a>
      </div>
      <div className="duck__wrapper">
        <div className="duck">
          <div className="duck__inner">
            <div className="duck__mouth" />
            <div className="duck__head">
              <div className="duck__eye" />
              <div className="duck__white" />
            </div>
            <div className="duck__body" />
            <div className="duck__wing" />
          </div>
          <div className="duck__foot duck__foot--1" />
          <div className="duck__foot duck__foot--2" />
          <div className="surface" />
        </div>
      </div>
    </div>
  </div>
}
