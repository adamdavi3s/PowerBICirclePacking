/// <amd-dependency path='circlepacking'>

module powerbi.extensibility.visual.PBI_CV_E43E8323_3100_4A3A_801E_B6C712747636  {
    export class Visual implements IVisual {
        private target: HTMLElement;
        private chart: any;
        private svg: d3.Selection<SVGElement>;



        constructor(options: VisualConstructorOptions) {
            //console.log('Visual constructor', options);
            this.target = options.element;
            let svg = this.svg = d3.select(options.element).append('svg').classed('circlepacking', true);

        }

      
        public update(options: VisualUpdateOptions) {
   


		    // get height and width from viewport
    this.svg.attr({
      height: options.viewport.height,
      width: options.viewport.width
    });
    var height = options.viewport.height;
    var width = options.viewport.width;  
//do the data stuff here
var dataview = options.dataViews[0].table.rows;


if (!this.chart) {
                  
this.chart = loadcirclepacking(this.svg, dataview, width,height);
 } else {
                         this.chart.update(dataview)
                     }

              }
					
	
					
					

        public destroy(): void {
            //TODO: Perform any cleanup tasks here
        }
    }


}