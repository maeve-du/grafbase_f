import { footerLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'

type ColumnProps = {
  title: string
  links: Array<string>
}

const FooterColoumn = ({ title, links }: ColumnProps) => (
  <div className='footer_column'>
    <h4 className='font-semibold'>{title}</h4>
    <ul className='flex flex-col gap-2 font-normal'>
      {links.map((link) => (
        <Link href='/' key={link}>
          {link}
        </Link>
      ))}
    </ul>
  </div>
)

const Footer = () => {
  return (
    <footer className='flexStart footer'>
      <div className='flex flex-col gap-12 w-full'>
        <div className='flex item-start flex-col'>
          <Image src='/logo-purple.svg' width={115} height={38} alt='Flexibble logo' />
          <p className='text-start text-sm font-normal mt-5 max-w-xs'>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima, aut sint?
          </p>
        </div>
        <div className='flex flex-wrap gap-12'>
          <FooterColoumn title={footerLinks[0].title} links={footerLinks[0].links} />
          <div className='flex flex-1 flex-col gap-4'>
            <FooterColoumn title={footerLinks[1].title} links={footerLinks[1].links} />
            <FooterColoumn title={footerLinks[2].title} links={footerLinks[2].links} />
          </div>
          <FooterColoumn title={footerLinks[3].title} links={footerLinks[3].links} />
          <div className='flex flex-1 flex-col gap-4'>
            <FooterColoumn title={footerLinks[4].title} links={footerLinks[4].links} />
            <FooterColoumn title={footerLinks[5].title} links={footerLinks[5].links} />
          </div>
          <FooterColoumn title={footerLinks[6].title} links={footerLinks[6].links} />
        </div>
      </div>
      <div className='flexBetween footer_copyright'>
        <p>@ 2023 Flexibble. All rights reserved</p>
        <p className='text-gray'>
          <span className='text-black font-semibold'>10,222</span> projects submitted
        </p>
      </div>
    </footer>
  )
}

export default Footer
