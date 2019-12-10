import React, { Component } from 'react';
import styles from './footer.module.css';
import { FaFacebookF } from 'react-icons/fa';
import { FaFacebookMessenger } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';
class Footer extends Component {
	handleSmoothScroll = () => {
		document.querySelector('#TOP').scrollIntoView({ behavior: 'smooth' });
		console.log('done');
	}
	
	render() {
		return (
			<div className={styles.Bottom}>
				{/* <div className={styles.firstFooterBox}>
					<a href="#TOP">About</a>
					<a href="#TOP">Need Help?</a>
					<a href="#TOP">Privacy</a>
				</div> */}
				<div className={styles.secondFooterBox}>
					<div>
						<p>
							RemoteHealthCare ©2019 
						</p>
					</div>
					{/* <ul>
						<li>
							<i>
								{''}
								<FaFacebookF />
							</i>
							<a onClick={this.handleSmoothScroll} href="#TOP">
								Facebook
							</a>
						</li>
						<li>
							<i>
								{''}
								<FaFacebookMessenger />
							</i>
							<a onClick={this.handleSmoothScroll} href="#TOP">
								Messenger
							</a>
						</li>
						<li>
							<i>
								{''}
								<FaTwitter />
							</i>
							<a onClick={this.handleSmoothScroll} href="#TOP">
								Twitter
							</a>
						</li>
						<li>
							<i>
								{''}
								<FaWhatsapp />
							</i>
							<a onClick={this.handleSmoothScroll} href="#TOP">
								WhatsApp
							</a>
						</li>
					</ul> */}
				</div>
			</div>
		);
	}
}

export default Footer;
