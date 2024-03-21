import { Accordion, AccordionTab } from 'primereact/accordion';
import SelectThumbnail from './SelectThumbnail';
import SelectImages from './SelectImages';
import { Demo } from '../../../../types/demo';
import { TabView, TabPanel } from 'primereact/tabview';

function ProductImages({ updateImages, updateThumbnail, product }: { updateImages: (value: File[]) => void;  updateThumbnail: (value: File | null) => void; product: Demo.Product}  ) {
    return ( 
        <>
            <div className='mb-3'>
                <SelectThumbnail product = { product } updateThumbnail = { updateThumbnail } />
            </div>
          
            <div>
                <SelectImages product = { product } updateImages = { updateImages } />
            </div>
            
          
        </>
     );
}

export default ProductImages;