class StickFigure {
    constructor() { // Store the ID without the hash
        this.margin = { top: 10, right: 10, bottom: 10, left: 10 }; // Set your margin values here

        this.svg = d3.select("#stickfigure")
            .append('svg')
            .attr('width', 500 + this.margin.left + this.margin.right)
            .attr('height', 800 + this.margin.top + this.margin.bottom)
            .style('position', 'relative'); // Adjust this value as needed

        this.danceability = 0.8;
        this.adjustDanceSpeed(this.danceability);

        this.drawStickFigure(this.svg);
        this.animateArms(this.svg);
        this.animateBody(this.svg);

    }


    drawStickFigure(svg) {
        // Adjust these values to move the stick figure higher up
        const yOffset = 140; // Increase the offset to move up by 100 units

        // Head
        svg.append("circle")
            .attr("cx", 200)
            .attr("cy", 60 + yOffset) // Adjust vertical position
            .attr("r", 20)
            .style("fill", "#5e4b98")
            .style("z-index", "1000");

        // smaller bubbles
        svg.append("circle")
            .attr("cx", 250)
            .attr("cy", 40 + yOffset) // Adjust vertical position
            .attr("r", 7)
            .style("fill", "#ffffff")
            .style("stroke", "#5e4b98")
            .style("stroke-width", "2px")
            .style("z-index", "1000");

        svg.append("circle")
            .attr("cx", 260)
            .attr("cy",  yOffset + 20) // Adjust vertical position
            .attr("r", 10)
            .style("fill", "#ffffff")
            .style("stroke", "#5e4b98")
            .style("stroke-width", "2px")
            .style("z-index", "1000");

        // Speech Bubble
        svg.append("ellipse")
            .attr("cx", 300)
            .attr("cy", yOffset - 20) // Adjust vertical position
            .attr("rx", 70)
            .attr("ry", 30)
            .style("fill", "#ffffff")
            .style("stroke", "#5e4b98")
            .style("stroke-width", "2px")
            .style("z-index", "1000");

        // Text inside the Speech Bubble
        svg.append("text")
            .attr("x", 300)
            .attr("y", yOffset - 15) // Adjust vertical position
            .text("Privacy is a hoax!")
            .style("font-size", "14px")
            .style("text-anchor", "middle")
            .style("font-family", "'Roboto', sans-serif")
            .style("fill", "#5e4b98")
            .style("z-index", "1000");

        // Body
        svg.append("line")
            .attr("x1", 200)
            .attr("y1", 80 + yOffset) // Adjust vertical position
            .attr("x2", 200)
            .attr("y2", 160 + yOffset) // Adjust vertical position
            .style("stroke", "#5e4b98")
            .style("z-index", "1000");

        // Left Arm
        svg.append("line")
            .attr("x1", 200)
            .attr("y1", 100 + yOffset) // Adjust vertical position
            .attr("x2", 160)
            .attr("y2", 120 + yOffset) // Adjust vertical position
            .style("stroke", "#5e4b98")
            .style("z-index", "1000");

        // Right Arm
        svg.append("line")
            .attr("x1", 200)
            .attr("y1", 100 + yOffset) // Adjust vertical position
            .attr("x2", 240)
            .attr("y2", 120 + yOffset) // Adjust vertical position
            .style("stroke", "#5e4b98")
            .style("z-index", "1000");

        // Left Leg
        svg.append("line")
            .attr("x1", 200)
            .attr("y1", 160 + yOffset) // Adjust vertical position
            .attr("x2", 180)
            .attr("y2", 200 + yOffset) // Adjust vertical position
            .style("stroke", "#5e4b98")
            .style("z-index", "1000");

        // Right Leg
        svg.append("line")
            .attr("x1", 200)
            .attr("y1", 160 + yOffset) // Adjust vertical position
            .attr("x2", 220)
            .attr("y2", 200 + yOffset) // Adjust vertical position
            .style("stroke", "#5e4b98");
    }

    animateArms(svg) {
        let duration = 3000;

        const animateArms = () => {
            this.svg.selectAll("line[x1='200'][y1='100']")
                .transition()
                .duration(duration / 2)
                .attr("y2", 100) // Move arms up
                .transition()
                .duration(duration / 2)
                .attr("y2", 120) // Move arms back down
                .on("end", animateArms);
        }

        animateArms();
    }

    animateBody(svg) {
        let duration = 800;

        const animateBody = () => {
            const partsToAnimate = this.svg.selectAll("line[x1='200'], circle[cx='200']");

            partsToAnimate
                .transition()
                .duration(duration / 2)
                .attr("transform", "rotate(10,200,120)")
                .transition()
                .duration(duration / 2)
                .attr("transform", "rotate(-10,200,120)")
                .on("end", animateBody);
        }

        animateBody();
    }

    adjustDanceSpeed() {
        this.animateArms(this.svg);
        this.animateBody(this.svg);
    }




}
